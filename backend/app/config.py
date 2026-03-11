import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "aiquest")
JWT_SECRET = os.getenv("JWT_SECRET", "change-this-to-a-strong-random-secret-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
LOCAL_LLM_PATH = os.getenv("LOCAL_LLM_PATH", "")
