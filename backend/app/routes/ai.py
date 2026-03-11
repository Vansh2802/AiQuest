import logging
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import TopicRequest, ChatMessage
from app.services.ai_service import explain_topic, generate_quiz, chat_with_tutor
from app.routes.deps import get_current_user

logger = logging.getLogger("ai_routes")

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/explain")
async def explain(req: TopicRequest, user=Depends(get_current_user)):
    try:
        result = await explain_topic(req.topic)
        return {"ok": True, "topic": req.topic, "explanation": result["explanation"]}
    except Exception as e:
        logger.error(f"Explain error: {e}")
        return {"ok": False, "message": "AI temporarily unavailable. Check LOCAL_LLM_PATH and model."}


@router.post("/quiz")
async def quiz(req: TopicRequest, user=Depends(get_current_user)):
    try:
        result = await generate_quiz(req.topic)
        return {"ok": True, "topic": req.topic, "questions": result["questions"]}
    except Exception as e:
        logger.error(f"Quiz error: {e}")
        return {"ok": False, "message": "AI temporarily unavailable. Check LOCAL_LLM_PATH and model."}


@router.post("/chat")
async def chat(req: ChatMessage, user=Depends(get_current_user)):
    try:
        result = await chat_with_tutor(req.message, req.topic)
        return {"ok": True, "reply": result["reply"]}
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return {"ok": False, "reply": "Sorry, I'm having trouble right now. Please try again!"}
