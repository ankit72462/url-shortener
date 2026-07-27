from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy import func
from app.database import get_db
from app.schemas.analytics import AnalyticsResponse, ClickTimeline, DeviceStats
from app.models.link import Link
from app.models.click import Click
from app.models.user import User
from app.routers.auth import get_current_user
import datetime
import collections

router = APIRouter(prefix='/api/v1/analytics', tags=['analytics'])

@router.get('/{short_code}', response_model=AnalyticsResponse)
async def get_analytics(
    short_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = db.execute(select(Link).where(Link.short_code == short_code, Link.owner_id == current_user.id))
    link = result.scalars().first()
    
    if not link:
        raise HTTPException(status_code=404, detail='Link not found or not owned by user')
        
    thirty_days_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=30)
    
    total_result = db.execute(select(func.count(Click.id)).where(Click.link_id == link.id))
    total_clicks = total_result.scalar() or 0
    
    clicks_result = db.execute(
        select(Click).where(Click.link_id == link.id, Click.clicked_at >= thirty_days_ago)
    )
    clicks = clicks_result.scalars().all()
    
    timeline_dict = collections.defaultdict(int)
    browser_dict = collections.defaultdict(int)
    os_dict = collections.defaultdict(int)
    device_dict = collections.defaultdict(int)
    referrer_dict = collections.defaultdict(int)
    country_dict = collections.defaultdict(int)
    
    for c in clicks:
        date_str = c.clicked_at.strftime('%Y-%m-%d') if c.clicked_at else 'Unknown'
        timeline_dict[date_str] += 1
        browser_dict[c.browser or 'Unknown'] += 1
        os_dict[c.os or 'Unknown'] += 1
        device_dict[c.device_type or 'Unknown'] += 1
        referrer_dict[c.referrer or 'Direct'] += 1
        country_dict[c.country or 'Unknown'] += 1
        
    timeline = [ClickTimeline(date=k, clicks=v) for k, v in sorted(timeline_dict.items())]
    devices = DeviceStats(
        browser=dict(browser_dict),
        os=dict(os_dict),
        device_type=dict(device_dict)
    )
    
    return AnalyticsResponse(
        total_clicks=total_clicks,
        timeline=timeline,
        devices=devices,
        referrers=dict(referrer_dict),
        countries=dict(country_dict)
    )
