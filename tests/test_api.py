import pytest
from fastapi.testclient import TestClient
from backend.main import app
from unittest.mock import AsyncMock, patch, MagicMock

from backend.services.rag import answer_question

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_security_headers_present():
    response = client.get("/api/health")
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["referrer-policy"] == "strict-origin-when-cross-origin"
    assert "geolocation=()" in response.headers["permissions-policy"]


def test_cors_preflight_uses_limited_methods():
    response = client.options(
        "/api/chat",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        },
    )
    assert response.status_code == 200
    assert "POST" in response.headers["access-control-allow-methods"]
    assert "DELETE" not in response.headers["access-control-allow-methods"]


def test_timeline():
    response = client.get("/api/timeline")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_learn():
    response = client.get("/api/learn")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    if len(response.json()) > 0:
        assert "slug" in response.json()[0]

def test_glossary():
    response = client.get("/api/glossary")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_sources():
    response = client.get("/api/sources")
    assert response.status_code == 200
    assert "sources" in response.json()
    assert isinstance(response.json()["sources"], list)

@patch("backend.services.gemini._ensure_init")
@patch("backend.services.gemini._model_flash")
@patch("backend.services.gemini.generate_answer")
def test_chat(mock_answer, mock_flash, mock_init):
    mock_init.return_value = True
    mock_response = MagicMock()
    mock_response.text = "general_question"
    mock_flash.generate_content.return_value = mock_response
    
    mock_answer.return_value = {"reply": "Mocked reply", "citations": []}
    
    response = client.post("/api/chat", json={"message": "Hello", "locale": "en"})
    assert response.status_code == 200
    assert "reply" in response.json()


@patch("backend.routers.chat.answer_question", new_callable=AsyncMock)
def test_chat_critical_error_is_redacted(mock_answer):
    mock_answer.side_effect = RuntimeError("secret-key-leaked")

    response = client.post("/api/chat", json={"message": "Hello", "locale": "en"})

    assert response.status_code == 200
    body = response.json()
    assert body["intent"] == "error"
    assert "secret-key-leaked" not in body["reply"]


def test_chat_rejects_invalid_payloads():
    empty_response = client.post("/api/chat", json={"message": "", "locale": "en"})
    bad_locale_response = client.post("/api/chat", json={"message": "Hello", "locale": "te"})

    assert empty_response.status_code == 422
    assert bad_locale_response.status_code == 422


@pytest.mark.asyncio
async def test_registration_questions_skip_classifier():
    with (
        patch("backend.services.rag.gemini.classify_intent", new_callable=AsyncMock) as mock_classify,
        patch("backend.services.rag.fetch_context", new_callable=AsyncMock) as mock_context,
        patch("backend.services.rag.gemini.generate_answer", new_callable=AsyncMock) as mock_answer,
    ):
        mock_context.return_value = "Form 6 verified context"
        mock_answer.return_value = {"reply": "Use Form 6.", "citations": []}

        result = await answer_question("What is Form 6?", locale="en")

    mock_classify.assert_not_called()
    mock_context.assert_awaited_once_with("how_to_register", "What is Form 6?")
    assert result["intent"] == "how_to_register"


@patch("backend.services.gemini.generate_quiz")
def test_quiz(mock_quiz):
    mock_quiz.return_value = [
        {
            "question": "Mock Question",
            "options": [{"label": "A", "text": "Opt A"}],
            "correct": "A",
            "explanation": "Mock explanation",
            "source_url": "http://example.com"
        }
    ]
    response = client.post("/api/quiz", json={"topic": "Voting", "count": 1})
    assert response.status_code == 200
    assert "questions" in response.json()
    assert isinstance(response.json()["questions"], list)

def test_eligibility():
    response = client.post("/api/eligibility", json={"age": 20, "nationality": "Indian", "has_epic": True})
    assert response.status_code == 200
    assert response.json()["eligible"] is True

def test_polling():
    response = client.get("/api/polling?q=Mumbai")
    assert response.status_code == 200
    # Polling station lookup might return a message if no real connector is active
    assert "message" in response.json() or "results" in response.json()


def test_geocode_falls_back_to_maps_link_without_key():
    with patch("backend.connectors.google_maps.GOOGLE_MAPS_API_KEY", ""):
        response = client.get("/api/location/geocode?q=Mumbai")

    assert response.status_code == 200
    body = response.json()
    assert body["lat"] is None
    assert body["lng"] is None
    assert body["source"] == "google_maps_link"
    assert body["open_maps_url"].startswith("https://www.google.com/maps/search/")


def test_progress_without_user_header_is_noop():
    response = client.post("/api/user/progress", json={"data": {"lesson": "intro"}})

    assert response.status_code == 200
    assert response.json() == {"status": "skipped", "message": "No User-ID provided", "persisted": False}


@patch("backend.connectors.firestore.save_user_progress", new_callable=AsyncMock)
def test_progress_persistence_noop_is_reported(mock_save):
    mock_save.return_value = False

    response = client.put("/api/progress/test-user", json={"data": {"quiz": 1}})

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "persisted": False}
