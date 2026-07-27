from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.models.logs import ActivityLog, FailureLog
from app.models.user import User
from app.schemas.logs import LogEntryResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])

async def get_current_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/logs/activity", response_model=List[LogEntryResponse])
async def get_activity_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    result = db.execute(select(ActivityLog).order_by(ActivityLog.created_at.desc()).offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/logs/failures", response_model=List[LogEntryResponse])
async def get_failure_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    result = db.execute(select(FailureLog).order_by(FailureLog.created_at.desc()).offset(skip).limit(limit))
    return result.scalars().all()
