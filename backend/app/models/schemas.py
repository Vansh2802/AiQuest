from pydantic import BaseModel, EmailStr
from typing import List, Optional


class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserProfile(BaseModel):
    username: str = ""
    email: str
    xp: int = 0
    level: int = 1
    completed_topics: List[str] = []
    interests: List[str] = []


class InterestsUpdate(BaseModel):
    interests: List[str]


class TopicRequest(BaseModel):
    topic: str


class ChatMessage(BaseModel):
    message: str
    topic: str = ""


class QuizAnswer(BaseModel):
    topic: str
    score: int
    total: int


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str


class ProgressResponse(BaseModel):
    xp: int
    level: int
    completed_topics: List[str]
