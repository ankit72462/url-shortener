import redis.asyncio as redis
from app.config import settings
import logging

logger = logging.getLogger(__name__)

redis_client: redis.Redis | None = None
redis_available: bool = False

async def init_redis():
    global redis_client, redis_available
    try:
        redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        await redis_client.ping()
        redis_available = True
        logger.info("✅ Redis connected successfully")
    except Exception as e:
        logger.warning(f"⚠️  Redis unavailable ({e}). Running without cache — DB will serve all reads.")
        redis_client = None
        redis_available = False

async def close_redis():
    global redis_client, redis_available
    if redis_client:
        await redis_client.aclose()
        redis_client = None
        redis_available = False

async def get_redis() -> redis.Redis | None:
    """Returns Redis client or None if unavailable."""
    return redis_client if redis_available else None
