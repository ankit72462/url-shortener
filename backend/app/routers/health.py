from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from redis.asyncio import Redis
from app.database import get_db
from app.redis_client import get_redis
from app.schemas.health import HealthResponse

router = APIRouter(prefix="/api/v1/health", tags=["health"])

@router.get("", response_model=HealthResponse)
async def check_health(db: AsyncSession = Depends(get_db), redis: Redis | None = Depends(get_redis)):
    db_status = "ok"
    try:
        await db.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"
        
    redis_status = "unavailable"
    if redis is not None:
        try:
            await redis.ping()
            redis_status = "ok"
        except Exception:
            redis_status = "error"
        
    overall_status = "ok" if db_status == "ok" else "degraded"
    
    return HealthResponse(
        status=overall_status,
        db=db_status,
        redis=redis_status
    )
