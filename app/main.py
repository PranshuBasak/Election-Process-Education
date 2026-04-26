from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os

app = FastAPI(title="Election Education Bot")

class ChatRequest(BaseModel):
    message: str
    session_id: str
    locale: str = "en"

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    return {"reply": f"Received: {request.message}"}

# Serve React App if exists
static_dir = os.path.join(os.path.dirname(__file__), "../web/dist")
if os.path.isdir(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
