from sqlalchemy.orm import Session
from sqlalchemy import select, update
from redis.asyncio import Redis
from app.models.link import Link
from app.schemas.link import CreateLinkRequest, LinkInfo
from app.services.id_generator import generate_id
from app.services.cache import get_cached_url, set_cached_url, set_negative_cache, NEGATIVE_CACHE_SENTINEL
from app.services.auth import get_password_hash
from fastapi import HTTPException
from app.models.click import Click
from user_agents import parse
import logging
import datetime
import random
import hashlib

logger = logging.getLogger(__name__)

async def create_short_link(db: Session, request: CreateLinkRequest, user_id: int | None = None) -> LinkInfo:
    long_url = str(request.long_url)
    
    is_custom_alias = False
    if request.custom_alias:
        # Check if custom alias exists
        result = db.execute(select(Link).where(Link.short_code == request.custom_alias))
        existing_link = result.scalar_one_or_none()
        if existing_link:
            raise HTTPException(status_code=409, detail="Custom alias already exists")
        
        snowflake_id, _ = generate_id()
        short_code = request.custom_alias
        is_custom_alias = True
    else:
        snowflake_id, short_code = generate_id()
        # Safety check — collision is extremely rare but handle it
        result = db.execute(select(Link).where(Link.short_code == short_code))
        if result.scalar_one_or_none():
            # Retry once
            snowflake_id, short_code = generate_id()

    pwd_hash = get_password_hash(request.password) if request.password else None

    new_link = Link(
        id=snowflake_id,
        short_code=short_code,
        long_url=long_url,
        expires_at=request.expires_at,
        owner_id=user_id,
        is_custom_alias=is_custom_alias,
        password_hash=pwd_hash
    )
    
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    
    return LinkInfo.model_validate(new_link)

async def resolve_short_code(db: Session, redis: Redis | None, short_code: str) -> tuple[str | None, bool]:
    # Try cache first (if Redis is available)
    if redis is not None:
        try:
            cached_url = await get_cached_url(redis, short_code)
            if cached_url is not None:
                if cached_url == NEGATIVE_CACHE_SENTINEL:
                    return None, False
                return cached_url, False  # Cached links never have passwords
        except Exception as e:
            logger.warning(f"Redis read error: {e}")
    
    # Cache miss or no Redis — query database
    result = db.execute(select(Link).where(Link.short_code == short_code))
    link = result.scalar_one_or_none()
    
    if link and link.is_active:
        # Check expiry
        if link.expires_at and link.expires_at < datetime.datetime.now(datetime.timezone.utc):
            if redis is not None:
                try:
                    await set_negative_cache(redis, short_code)
                except Exception:
                    pass
            return None, False
            
        # Cache the result for next time ONLY if there is no password
        if not link.has_password:
            if redis is not None:
                try:
                    await set_cached_url(redis, short_code, link.long_url)
                except Exception:
                    pass
        return link.long_url, link.has_password
    
    # Not found — negative cache
    if redis is not None:
        try:
            await set_negative_cache(redis, short_code)
        except Exception:
            pass
    return None, False

async def record_click(db: Session, short_code: str, req_info: dict):
    # First get the link id
    result = db.execute(select(Link.id).where(Link.short_code == short_code))
    link_id = result.scalar_one_or_none()
    
    if not link_id:
        return
        
    # Increment count
    db.execute(
        update(Link)
        .where(Link.id == link_id)
        .values(click_count=Link.click_count + 1)
    )
    
    # Parse User-Agent
    user_agent_str = req_info.get("user_agent", "")
    ua = parse(user_agent_str) if user_agent_str else None
    
    browser = ua.browser.family if ua else "Unknown"
    os = ua.os.family if ua else "Unknown"
    device_type = "Mobile" if ua and ua.is_mobile else "Tablet" if ua and ua.is_tablet else "PC" if ua and ua.is_pc else "Unknown"
    
    # Obscure IP
    ip_raw = req_info.get("ip", "")
    ip_hash = hashlib.sha256(ip_raw.encode()).hexdigest()[:16] if ip_raw else "Unknown"
    
    # Mock Country/City
    countries = ["US", "UK", "IN", "CA", "AU", "DE", "FR"]
    country = random.choice(countries)
    city = "Unknown"
    
    new_click = Click(
        link_id=link_id,
        ip_address=ip_hash,
        country=country,
        city=city,
        referrer=req_info.get("referer"),
        user_agent=user_agent_str,
        browser=browser,
        os=os,
        device_type=device_type
    )
    
    db.add(new_click)
    db.commit()
