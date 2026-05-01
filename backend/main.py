"""FastAPI entry point: routers, CORS, and static React mount."""

from __future__ import annotations

import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.models.schemas import HealthResponse
from backend.routers import chat, glossary, polling, quiz, sources, steps, timeline, user

app = FastAPI(
    title="Election Education Bot",
    description="AI-powered Indian election education assistant",
    version="1.0.0",
)

default_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://election-edu-852805379097.asia-south1.run.app",
]
configured_origins = os.getenv("CORS_ORIGINS", "")
allowed_origins = [origin.strip() for origin in configured_origins.split(",") if origin.strip()] or default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(timeline.router)
app.include_router(steps.router)
app.include_router(glossary.router)
app.include_router(quiz.router)
app.include_router(polling.router)
app.include_router(sources.router)
app.include_router(user.router)
app.include_router(user.progress_router)


@app.get("/api/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok", version="1.0.0")


static_dir = os.path.join(os.path.dirname(__file__), "..", "web", "dist")
if os.path.isdir(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
