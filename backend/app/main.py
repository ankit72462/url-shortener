import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_tables
from app.redis_client import init_redis, close_redis
from app.routers import links, redirect, health, auth, analytics, admin
import app.models.link
import app.models.user
import app.models.click
import app.models.logs

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    await init_redis()
    yield
    # Shutdown
    await close_redis()

app = FastAPI(
    title="URL Shortener API",
    description="Phase 2 for URL Shortener Service",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(links.router)
app.include_router(analytics.router)
app.include_router(admin.router)
# Redirect router must be last because of catch-all route /{short_code}
app.include_router(redirect.router)
