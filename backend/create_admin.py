from app.database import SessionLocal
from app.models.user import User
from app.services.auth import get_password_hash
from app.services.id_generator import generate_id
from sqlalchemy import select

def create_admin():
    with SessionLocal() as session:
        # Check if user already exists
        result = session.execute(select(User).filter(User.email == "admin@linksnap.dev"))
        existing_user = result.scalars().first()
        
        if existing_user:
            print(f"User with email {existing_user.email} already exists. Promoting to admin...")
            existing_user.is_admin = True
            existing_user.hashed_password = get_password_hash("Pass@123")
            existing_user.username = "ankit4205"
            existing_user.first_name = "Ankit"
            existing_user.last_name = "Kumar"
            session.commit()
            print("Done.")
            return

        user_id, _ = generate_id()
        hashed_password = get_password_hash("Pass@123")
        
        new_user = User(
            id=user_id,
            username="ankit4205",
            email="admin@linksnap.dev",
            first_name="Ankit",
            last_name="Kumar",
            hashed_password=hashed_password,
            is_admin=True
        )
        
        session.add(new_user)
        session.commit()
        print(f"Successfully created admin user: ankit4205 (admin@linksnap.dev)")

if __name__ == "__main__":
    create_admin()
