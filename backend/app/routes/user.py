from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import QuizAnswer, ProgressResponse, UserProfile, InterestsUpdate
from app.database import users_collection
from app.routes.deps import get_current_user

router = APIRouter(prefix="/api/user", tags=["user"])

LEVEL_THRESHOLDS = {1: 0, 2: 50, 3: 120, 4: 250}

ALL_TOPICS = {
    "Web Development": [
        {
            "id": "web-dev",
            "title": "Web Development",
            "difficulty": "Beginner",
            "description": "Learn the fundamentals of building websites with HTML, CSS, and JavaScript.",
            "category": "Web Development",
        },
    ],
    "Data Structures": [
        {
            "id": "binary-search",
            "title": "Binary Search",
            "difficulty": "Intermediate",
            "description": "Efficiently search sorted data by repeatedly dividing the search interval in half.",
            "category": "Data Structures",
        },
        {
            "id": "sorting-algorithms",
            "title": "Sorting Algorithms",
            "difficulty": "Intermediate",
            "description": "Learn how to organize data efficiently using various sorting techniques.",
            "category": "Data Structures",
        },
    ],
    "Algorithms": [
        {
            "id": "recursion",
            "title": "Recursion",
            "difficulty": "Intermediate",
            "description": "Understand how functions can call themselves to solve complex problems elegantly.",
            "category": "Algorithms",
        },
        {
            "id": "sorting-algorithms",
            "title": "Sorting Algorithms",
            "difficulty": "Intermediate",
            "description": "Learn how to organize data efficiently using various sorting techniques.",
            "category": "Algorithms",
        },
    ],
    "Python": [
        {
            "id": "python-lists",
            "title": "Python Lists",
            "difficulty": "Beginner",
            "description": "Master Python's most versatile data structure for storing and manipulating collections.",
            "category": "Python",
        },
    ],
    "Machine Learning": [
        {
            "id": "intro-ml",
            "title": "Introduction to Machine Learning",
            "difficulty": "Advanced",
            "description": "Discover how machines learn from data to make predictions and decisions.",
            "category": "Machine Learning",
        },
    ],
    "Data Science": [
        {
            "id": "intro-data-science",
            "title": "Introduction to Data Science",
            "difficulty": "Intermediate",
            "description": "Learn to extract insights from data using statistics and visualization.",
            "category": "Data Science",
        },
    ],
    "JavaScript": [
        {
            "id": "javascript-closures",
            "title": "JavaScript Closures",
            "difficulty": "Intermediate",
            "description": "Understand how closures capture variables and enable powerful programming patterns.",
            "category": "JavaScript",
        },
    ],
}


def calculate_level(xp: int) -> int:
    level = 1
    for lvl, threshold in sorted(LEVEL_THRESHOLDS.items()):
        if xp >= threshold:
            level = lvl
    return level


@router.get("/progress", response_model=ProgressResponse)
async def get_progress(user=Depends(get_current_user)):
    return ProgressResponse(
        xp=user.get("xp", 0),
        level=user.get("level", 1),
        completed_topics=user.get("completed_topics", []),
    )


@router.get("/profile", response_model=UserProfile)
async def get_profile(user=Depends(get_current_user)):
    return UserProfile(
        username=user.get("username", ""),
        email=user["email"],
        xp=user.get("xp", 0),
        level=user.get("level", 1),
        completed_topics=user.get("completed_topics", []),
        interests=user.get("interests", []),
    )


@router.post("/interests")
async def update_interests(data: InterestsUpdate, user=Depends(get_current_user)):
    await users_collection.update_one(
        {"email": user["email"]},
        {"$set": {"interests": data.interests}},
    )
    return {"ok": True, "interests": data.interests}


@router.get("/topics")
async def get_topics(user=Depends(get_current_user)):
    interests = user.get("interests", [])
    if not interests:
        interests = list(ALL_TOPICS.keys())

    topics = []
    seen_ids = set()
    for interest in interests:
        for t in ALL_TOPICS.get(interest, []):
            if t["id"] not in seen_ids:
                seen_ids.add(t["id"])
                topics.append(t)

    completed = user.get("completed_topics", [])
    for t in topics:
        t["completed"] = t["title"] in completed

    return {"ok": True, "topics": topics}


@router.post("/submit-quiz")
async def submit_quiz(answer: QuizAnswer, user=Depends(get_current_user)):
    xp_earned = answer.score * 10
    new_xp = user.get("xp", 0) + xp_earned
    new_level = calculate_level(new_xp)

    completed = user.get("completed_topics", [])
    if answer.topic not in completed:
        completed.append(answer.topic)

    await users_collection.update_one(
        {"email": user["email"]},
        {"$set": {"xp": new_xp, "level": new_level, "completed_topics": completed}},
    )

    leveled_up = new_level > user.get("level", 1)

    return {
        "xp_earned": xp_earned,
        "total_xp": new_xp,
        "level": new_level,
        "leveled_up": leveled_up,
        "completed_topics": completed,
    }
