from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from typing import List

from app.database import get_db
from app.schemas.link import CreateLinkRequest, CreateLinkResponse, LinkInfo, UpdateLinkRequest, UnlockLinkRequest
from app.services.shortener import create_short_link, record_click
from app.services.auth import verify_password
from app.utils.url_validator import validate_url
from app.config import settings
from app.models.link import Link
from app.models.user import User
from app.routers.auth import get_current_user_optional, get_current_user
from app.redis_client import get_redis
from app.services.cache import invalidate_cache
from app.services.logger import log_activity

router = APIRouter(prefix="/api/v1/links", tags=["links"])

@router.post("", response_model=CreateLinkResponse, status_code=status.HTTP_201_CREATED)
async def create_link(
    request_data: CreateLinkRequest, 
    request: Request,
    db: AsyncSession = Depends(get_db), 
    current_user: User | None = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else None
    
    # Enforce rate limit for anonymous users (10 links per 12 hours)
    if user_id is None:
        ip_addr = request.client.host
        redis = await get_redis()
        if redis:
            key = f"ratelimit:anon:{ip_addr}"
            count = await redis.get(key)
            if count and int(count) >= 10:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Anonymous creation limit reached. Please sign up to create more links."
                )
            # Increment and set TTL if new key
            count = await redis.incr(key)
            if count == 1:
                await redis.expire(key, 43200) # 12 hours
        else:
            # Fallback to database check using ActivityLog
            from app.models.logs import ActivityLog
            from datetime import datetime, timedelta
            time_limit = datetime.utcnow() - timedelta(hours=12)
            result = await db.execute(
                select(ActivityLog)
                .filter(
                    ActivityLog.ip_address == ip_addr,
                    ActivityLog.action == "LINK_CREATED",
                    ActivityLog.created_at >= time_limit
                )
            )
            logs = result.scalars().all()
            if len(logs) >= 10:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Anonymous creation limit reached. Please sign up to create more links."
                )

    validate_url(str(request_data.long_url))
    link_info = await create_short_link(db, request_data, user_id=user_id)
    
    await log_activity(db, "LINK_CREATED", {"short_code": link_info.short_code, "long_url": link_info.long_url}, user_id=user_id, ip_address=request.client.host)
    
    return CreateLinkResponse(
        short_code=link_info.short_code,
        short_url=f"{settings.BASE_URL.rstrip('/')}/{link_info.short_code}",
        long_url=link_info.long_url,
        created_at=link_info.created_at
    )

@router.get("", response_model=List[LinkInfo])
async def list_links(
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Link).filter(Link.owner_id == current_user.id))
    links = result.scalars().all()
    return links

@router.patch("/{short_code}", response_model=LinkInfo)
async def update_link(
    short_code: str,
    request: UpdateLinkRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    redis = Depends(get_redis)
):
    result = await db.execute(select(Link).filter(Link.short_code == short_code, Link.owner_id == current_user.id))
    link = result.scalars().first()
    
    if not link:
        raise HTTPException(status_code=404, detail="Link not found or not owned by user")
    
    if request.long_url is not None:
        validate_url(str(request.long_url))
        link.long_url = str(request.long_url)
    
    if request.is_active is not None:
        link.is_active = request.is_active
        
    if request.expires_at is not None:
        link.expires_at = request.expires_at
    
    await db.commit()
    await db.refresh(link)
    
    if redis:
        try:
            await invalidate_cache(redis, short_code)
        except Exception:
            pass
            
    return LinkInfo.model_validate(link)

@router.delete("/{short_code}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_link(
    short_code: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    redis = Depends(get_redis)
):
    result = await db.execute(select(Link).filter(Link.short_code == short_code, Link.owner_id == current_user.id))
    link = result.scalars().first()
    
    if not link:
        raise HTTPException(status_code=404, detail="Link not found or not owned by user")
        
    await db.delete(link)
    await db.commit()
    
    if redis:
        try:
            await invalidate_cache(redis, short_code)
        except Exception:
            pass

@router.post("/{short_code}/unlock")
async def unlock_link(
    short_code: str,
    request_data: UnlockLinkRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Link).filter(Link.short_code == short_code))
    link = result.scalars().first()
    
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
        
    if not link.password_hash:
        return {"long_url": link.long_url}
        
    if not verify_password(request_data.password, link.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password")
        
    # Log click
    req_info = {
        "ip": request.client.host if request.client else "",
        "user_agent": request.headers.get("user-agent", ""),
        "referer": request.headers.get("referer", "")
    }
    
    # Run record_click here (no BackgroundTasks injected to simplify, or could use BackgroundTasks)
    # Waiting on it is fine for unlocking, or we can use BackgroundTasks. Let's use BackgroundTasks.
    # Wait, I didn't import BackgroundTasks in links.py. I'll just await record_click.
    try:
        await record_click(db, short_code, req_info)
    except Exception:
        pass
        
    return {"long_url": link.long_url}
