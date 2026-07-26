from pydantic import BaseModel
from typing import List, Dict, Any

class ClickTimeline(BaseModel):
    date: str
    clicks: int

class DeviceStats(BaseModel):
    browser: Dict[str, int]
    os: Dict[str, int]
    device_type: Dict[str, int]

class AnalyticsResponse(BaseModel):
    total_clicks: int
    timeline: List[ClickTimeline]
    devices: DeviceStats
    referrers: Dict[str, int]
    countries: Dict[str, int]
