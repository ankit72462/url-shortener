from pydantic import BaseModel, HttpUrl, ConfigDict
from typing import Optional
from datetime import datetime

class CreateLinkRequest(BaseModel):
    long_url: HttpUrl
    custom_alias: Optional[str] = None
    expires_at: Optional[datetime] = None
    password: Optional[str] = None

class CreateLinkResponse(BaseModel):
    short_code: str
    short_url: str
    long_url: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UnlockLinkRequest(BaseModel):
    password: str

class UpdateLinkRequest(BaseModel):
    long_url: Optional[HttpUrl] = None
    is_active: Optional[bool] = None
    expires_at: Optional[datetime] = None

class LinkInfo(BaseModel):
    id: int
    short_code: str
    long_url: str
    is_active: bool
    created_at: datetime
    expires_at: Optional[datetime]
    click_count: int
    owner_id: Optional[int] = None
    is_custom_alias: bool = False
    has_password: bool = False

    model_config = ConfigDict(from_attributes=True)
