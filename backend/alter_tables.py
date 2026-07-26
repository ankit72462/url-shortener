import asyncio
from app.database import engine
from sqlalchemy import text

async def alter_tables():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE links ADD password_hash VARCHAR(255) NULL;"))
            print("Successfully added password_hash to links table.")
        except Exception as e:
            print(f"Error altering table: {e}")

if __name__ == "__main__":
    asyncio.run(alter_tables())
