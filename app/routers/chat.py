"""Chat router — POST /api/chat

Full RAG pipeline: intent classification → connector fetch → Gemini answer.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.models.schemas import ChatRequest, ChatResponse, Citation
from app.services.rag import answer_question

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    result = await answer_question(req.message, locale=req.locale)
    citations = [
        Citation(title=c.get("title", ""), url=c.get("url", ""))
        for c in result.get("citations", [])
    ]
    return ChatResponse(
        reply=result.get("reply", ""),
        citations=citations,
        intent=result.get("intent", ""),
    )
