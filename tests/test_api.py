import pytest
from fastapi.testclient import TestClient
from backend.main import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

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
