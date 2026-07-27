from sqlalchemy.orm import Session
from app.models.logs import ActivityLog, FailureLog
import json

async def log_activity(db: Session, action: str, details: dict = None, user_id: int = None, ip_address: str = None):
    log_entry = ActivityLog(
        action=action,
        details=json.dumps(details) if details else None,
        user_id=user_id,
        ip_address=ip_address
    )
    db.add(log_entry)
    db.commit()

async def log_failure(db: Session, error_type: str, details: dict = None, user_id: int = None, ip_address: str = None):
    log_entry = FailureLog(
        error_type=error_type,
        details=json.dumps(details) if details else None,
        user_id=user_id,
        ip_address=ip_address
    )
    db.add(log_entry)
    db.commit()
