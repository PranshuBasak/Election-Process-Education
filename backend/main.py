"""FastAPI entry point — registers all routers, CORS, and static mount."""

from __future__ import annotations

import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.models.schemas import HealthResponse
from backend.routers import chat, timeline, steps, glossary, quiz, polling, sources

app = FastAPI(
    title="Election Education Bot",
    description="AI-powered Indian election education assistant",
    version="1.0.0",
)

# CORS — allow Vite dev server + production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chat.router)
app.include_router(timeline.router)
app.include_router(steps.router)
app.include_router(glossary.router)
app.include_router(quiz.router)
app.include_router(polling.router)
app.include_router(sources.router)


@app.get("/api/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok", version="1.0.0")


# Serve React SPA if built
static_dir = os.path.join(os.path.dirname(__file__), "..", "web", "dist")
if os.path.isdir(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
