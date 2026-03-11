import motor.motor_asyncio
from app.config import MONGODB_URL, DATABASE_NAME

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

users_collection = db["users"]
progress_collection = db["progress"]
