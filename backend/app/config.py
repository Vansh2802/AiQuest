import os
import secrets
from dotenv import load_dotenv

load_dotenv()

# Security Configuration
# IMPORTANT: All sensitive values must be set via environment variables
# Never commit actual secrets to version control

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "aiquest")

# JWT Secret - MUST be set in production
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    # Generate a secure random secret for development only
    # Production MUST set this via environment variable
    JWT_SECRET = secrets.token_urlsafe(32)
    print("⚠️  WARNING: Using auto-generated JWT_SECRET for development")
    print("⚠️  PRODUCTION MUST SET JWT_SECRET environment variable!")

JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Optional API Keys
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
LOCAL_LLM_PATH = os.getenv("LOCAL_LLM_PATH", "")
