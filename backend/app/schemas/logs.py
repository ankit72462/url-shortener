from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime
import json

class LogEntryResponse(BaseModel):
    id: int
    user_id: Optional[int]
    action: Optional[str] = None
    error_type: Optional[str] = None
    details: Optional[Any]
    ip_address: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

    # Parse details from string to dict if needed
    def __init__(self, **data):
        super().__init__(**data)
        if isinstance(self.details, str):
            try:
                self.details = json.loads(self.details)
            except:
                pass
