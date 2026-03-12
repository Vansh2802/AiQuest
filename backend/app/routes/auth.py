from fastapi import APIRouter, HTTPException
from app.models.schemas import UserSignup, UserLogin, TokenResponse
from app.services.auth_utils import hash_password, verify_password, create_token
from app.database import users_collection
import logging

logger = logging.getLogger("auth_routes")

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
async def signup(user: UserSignup):
    try:
        # Check if email already exists
        existing = await users_collection.find_one({"email": user.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check if username already exists
        existing_username = await users_collection.find_one({"username": user.username})
        if existing_username:
            raise HTTPException(status_code=400, detail="Username already taken")

        # Hash password and create user
        hashed = hash_password(user.password)
        user_doc = {
            "username": user.username,
            "email": user.email,
            "password": hashed,
            "xp": 0,
            "level": 1,
            "completed_topics": [],
            "interests": [],
        }
        result = await users_collection.insert_one(user_doc)
        
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        # Generate token
        token = create_token(user.email)
        logger.info(f"User created successfully: {user.email}")
        return TokenResponse(access_token=token, token_type="bearer")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")


@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(user.email)
    return TokenResponse(access_token=token)
