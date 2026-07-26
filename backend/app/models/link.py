from sqlalchemy import Column, String, Text, Boolean, DateTime, BigInteger, func, ForeignKey
from app.database import Base

class Link(Base):
    __tablename__ = "links"
    id = Column(BigInteger, primary_key=True)
    short_code = Column(String(16), unique=True, nullable=False, index=True)
    long_url = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    click_count = Column(BigInteger, default=0, nullable=False)
    owner_id = Column(BigInteger, ForeignKey("users.id"), nullable=True, index=True)
    is_custom_alias = Column(Boolean, default=False, nullable=False)
    password_hash = Column(String(255), nullable=True)

    @property
    def has_password(self) -> bool:
        return self.password_hash is not None
