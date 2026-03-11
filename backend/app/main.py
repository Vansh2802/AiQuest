import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.routes import auth, ai, user
from app.services.ai_service import chat_with_tutor

app = FastAPI(title="AI Super Quest API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(ai.router)
app.include_router(user.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "app": "AI Super Quest"}


class ChatRequest(BaseModel):
    message: str


@app.post("/api/chat")
async def chat_simple(req: ChatRequest):
    """Public chat endpoint (no auth required) - POST /api/chat"""
    result = await chat_with_tutor(req.message, "")
    return {"reply": result["reply"]}


# --- Serve React frontend in production ---
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

if STATIC_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        """Serve the React SPA for any non-API route."""
        file_path = STATIC_DIR / full_path
        if full_path and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(STATIC_DIR / "index.html")
