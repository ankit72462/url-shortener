from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.config import settings
import ssl

ctx = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Strip ?ssl=true from URL if present and use connect_args
db_url = settings.DATABASE_URL.replace("?ssl=true", "").replace("?ssl_verify_cert=true&ssl_verify_identity=true", "")

engine = create_engine(db_url, connect_args={"ssl": ctx}, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
