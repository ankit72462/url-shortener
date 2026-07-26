from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.database import Base

class Click(Base):
    __tablename__ = 'clicks'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    link_id = Column(BigInteger, ForeignKey('links.id', ondelete='CASCADE'), nullable=False, index=True)
    clicked_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ip_address = Column(String(50), nullable=True)
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    referrer = Column(Text, nullable=True)
    user_agent = Column(Text, nullable=True)
    browser = Column(String(100), nullable=True)
    os = Column(String(100), nullable=True)
    device_type = Column(String(50), nullable=True)
