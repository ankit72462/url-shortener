from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from redis.asyncio import Redis
from app.database import get_db, SessionLocal
from app.redis_client import get_redis
from app.services.shortener import resolve_short_code, record_click
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["redirect"])

async def background_record_click(short_code: str, req_info: dict):
    try:
        with SessionLocal() as session:
            await record_click(session, short_code, req_info)
    except Exception as e:
        logger.error(f"Failed to record click for {short_code}: {e}")

@router.get("/{short_code}")
async def redirect_to_long_url(
    short_code: str, 
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    redis: Redis | None = Depends(get_redis)
):
    long_url, has_password = await resolve_short_code(db, redis, short_code)
    
    if not long_url:
        raise HTTPException(status_code=404, detail="Link not found or expired")
        
    if has_password:
        # Redirect to the frontend unlock page
        # In development, the frontend is typically on localhost:3000
        # In production, it would be the same domain, so a relative redirect could work if they are on the same domain
        # Assuming frontend URL is needed. For now, use http://localhost:3000
        from app.config import settings
        frontend_url = "http://localhost:3000"
        return RedirectResponse(url=f"{frontend_url}/unlock/{short_code}", status_code=302)

    req_info = {
        "ip": request.client.host if request.client else "",
        "user_agent": request.headers.get("user-agent", ""),
        "referer": request.headers.get("referer", "")
    }
        
    background_tasks.add_task(background_record_click, short_code, req_info)
    
    return RedirectResponse(url=long_url, status_code=302)
