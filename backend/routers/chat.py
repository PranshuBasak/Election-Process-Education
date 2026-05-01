"""Chat router — POST /api/chat

Full RAG pipeline: intent classification → connector fetch → Gemini answer.
"""

from __future__ import annotations

from fastapi import APIRouter

from backend.models.schemas import ChatRequest, ChatResponse, Citation
from backend.services.rag import answer_question
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    logger.info("Chat request received locale=%s length=%s", req.locale, len(req.message))
    
    try:
        result = await answer_question(req.message, locale=req.locale)
        logger.info(f"RAG result obtained: intent={result.get('intent')}")
        
        citations = [
            Citation(title=c.get("title", ""), url=c.get("url", ""))
            for c in result.get("citations", [])
        ]
        
        response = ChatResponse(
            reply=result.get("reply", ""),
            citations=citations,
            intent=result.get("intent", ""),
            grounded=bool(result.get("grounded", False)),
        )
        
        logger.info(f"Outgoing reply length: {len(response.reply)}")
        
        if response.reply.startswith("I'm currently unable to connect"):
            logger.error("CHAT_ERROR: Backend returned fallback connection error. Check Gemini API key and enablement.")
        
        return response
    except Exception as e:
        logger.exception(f"CHAT_CRITICAL_ERROR: {str(e)}")
        return ChatResponse(
            reply="I'm sorry, an internal server error occurred while processing your request.",
            citations=[],
            intent="error"
        )
