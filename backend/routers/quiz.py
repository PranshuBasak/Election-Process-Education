"""Quiz router — POST /api/quiz

Generates election-education quiz questions using Gemini with fallback.
"""

from __future__ import annotations

from fastapi import APIRouter

from backend.models.schemas import QuizRequest, QuizResponse, QuizQuestion, QuizOption
from backend.services import gemini

router = APIRouter(prefix="/api", tags=["quiz"])


@router.post("/quiz", response_model=QuizResponse)
async def generate_quiz(req: QuizRequest) -> QuizResponse:
    raw = await gemini.generate_quiz(
        topic=req.topic,
        difficulty=req.difficulty,
        count=req.count,
        locale=req.locale,
    )

    questions: list[QuizQuestion] = []
    for q in raw:
        options = [
            QuizOption(label=o.get("label", ""), text=o.get("text", ""))
            for o in q.get("options", [])
        ]
        questions.append(
            QuizQuestion(
                question=q.get("question", ""),
                options=options,
                correct=q.get("correct", ""),
                explanation=q.get("explanation", ""),
                source_url=q.get("source_url", ""),
            )
        )

    return QuizResponse(topic=req.topic, questions=questions)
