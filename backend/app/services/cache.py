from redis.asyncio import Redis

NEGATIVE_CACHE_SENTINEL = "__NOT_FOUND__"

async def get_cached_url(redis: Redis, short_code: str) -> str | None:
    """Try cache first, return long_url or None"""
    val = await redis.get(f"url:{short_code}")
    if val:
        return val
    return None

async def set_cached_url(redis: Redis, short_code: str, long_url: str, ttl: int = 3600):
    """Cache a short_code -> long_url mapping"""
    await redis.set(f"url:{short_code}", long_url, ex=ttl)

async def set_negative_cache(redis: Redis, short_code: str, ttl: int = 60):
    """Cache a 'not found' sentinel"""
    await redis.set(f"url:{short_code}", NEGATIVE_CACHE_SENTINEL, ex=ttl)

async def invalidate_cache(redis: Redis, short_code: str):
    """Remove a cache entry"""
    await redis.delete(f"url:{short_code}")
