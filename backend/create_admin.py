import asyncio
from app.database import AsyncSessionLocal
from app.models.user import User
from app.services.auth import get_password_hash
from app.services.id_generator import generate_id
from sqlalchemy.future import select

async def create_admin():
    async with AsyncSessionLocal() as session:
        # Check if user already exists
        result = await session.execute(select(User).filter(User.email == "admin@linksnap.dev"))
        existing_user = result.scalars().first()
        
        if existing_user:
            print(f"User with email {existing_user.email} already exists. Promoting to admin...")
            existing_user.is_admin = True
            existing_user.hashed_password = get_password_hash("Pass@123")
            existing_user.username = "Ankit Kumar"
            existing_user.first_name = "Ankit"
            existing_user.last_name = "Kumar"
            await session.commit()
            print("Done.")
            return

        user_id, _ = generate_id()
        hashed_password = get_password_hash("Pass@123")
        
        new_user = User(
            id=user_id,
            username="Ankit Kumar",
            email="admin@linksnap.dev",
            first_name="Ankit",
            last_name="Kumar",
            hashed_password=hashed_password,
            is_admin=True
        )
        
        session.add(new_user)
        await session.commit()
        print(f"Successfully created admin user: Ankit Kumar (admin@linksnap.dev)")

if __name__ == "__main__":
    asyncio.run(create_admin())
