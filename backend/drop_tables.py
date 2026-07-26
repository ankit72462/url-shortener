import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings
from app.models.link import Link
from app.models.user import User
from app.models.click import Click
from app.database import Base

async def drop_all_tables():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        print('Dropping tables...')
        await conn.run_sync(Base.metadata.drop_all)
        print('Tables dropped.')
    await engine.dispose()

if __name__ == '__main__':
    asyncio.run(drop_all_tables())
