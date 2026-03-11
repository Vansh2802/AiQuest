from fastapi import APIRouter, HTTPException
from app.models.schemas import UserSignup, UserLogin, TokenResponse
from app.services.auth_utils import hash_password, verify_password, create_token
from app.database import users_collection

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
async def signup(user: UserSignup):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)
    await users_collection.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed,
        "xp": 0,
        "level": 1,
        "completed_topics": [],
        "interests": [],
    })
    token = create_token(user.email)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(user.email)
    return TokenResponse(access_token=token)
