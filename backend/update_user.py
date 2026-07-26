import asyncio
from app.database import AsyncSessionLocal
from app.models.user import User
from sqlalchemy.future import select
from app.services.auth import get_password_hash

async def update_user():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).filter(User.username == "Ankit Kumar"))
        user = result.scalars().first()
        if user:
            user.email = "admin@linksnap.dev"
            user.first_name = "Ankit"
            user.last_name = "Kumar"
            user.hashed_password = get_password_hash("Pass@123")
            user.is_admin = True
            await session.commit()
            print("Successfully updated user.")
        else:
            print("User not found.")

if __name__ == "__main__":
    asyncio.run(update_user())
