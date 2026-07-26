from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import JWTError, jwt

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token, TokenData
from app.services.auth import get_password_hash, verify_password, create_access_token
from app.config import settings
from app.services.id_generator import generate_id
from app.services.logger import log_activity, log_failure

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=int(user_id))
    except JWTError:
        raise credentials_exception
    
    result = await db.execute(select(User).filter(User.id == token_data.user_id))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_user_optional(token: str | None = Depends(OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)), db: AsyncSession = Depends(get_db)):
    if not token:
        return None
    try:
        return await get_current_user(token, db)
    except HTTPException:
        return None

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter((User.username == user.username) | (User.email == user.email)))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    user_id, _ = generate_id()
    hashed_password = get_password_hash(user.password)
    
    new_user = User(
        id=user_id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        mobile_number=user.mobile_number,
        hashed_password=hashed_password
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    await log_activity(db, "USER_SIGNUP", {"username": user.username}, user_id=new_user.id, ip_address=request.client.host)
    return new_user

@router.post("/login", response_model=Token)
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter((User.username == form_data.username) | (User.email == form_data.username)))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        await log_failure(db, "LOGIN_FAILED", {"username": form_data.username}, user_id=user.id if user else None, ip_address=request.client.host)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    await log_activity(db, "LOGIN_SUCCESS", {"username": user.username}, user_id=user.id, ip_address=request.client.host)
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
