from fastapi import FastAPI, APIRouter, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
from agents.orchestrator import Orchestrator

# Initialize AI Brain
orchestrator = Orchestrator()

app = FastAPI(title="Myriox AI API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models for requests
class ChatRequest(BaseModel):
    query: str
    dataset_id: Optional[int] = None
    model: Optional[str] = "normal"

class ProjectRequest(BaseModel):
    title: str

class SessionRequest(BaseModel):
    id: str
    title: str
    project_id: Optional[int] = None

# Router
router = APIRouter(prefix="/api")

@router.get("/health")
async def health():
    return {"status": "online", "message": "Myriox Neural Core Standing By"}

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        # ส่งคำถามไปยัง Orchestrator
        # เราส่ง df=None ไปก่อน เพราะตอนนี้ยังไม่ได้โหลดไฟล์
        response = await orchestrator.chat_with_data(request.query, None, request.model)
        return {"response": response}
    except Exception as e:
        return {"response": f"Backend Error: {str(e)}"}

@router.get("/chat/sessions")
async def get_sessions():
    return []

@router.post("/chat/sessions")
async def create_session(request: SessionRequest):
    return {"status": "ok"}

@router.get("/projects")
async def get_projects():
    return []

@router.post("/projects")
async def create_project(request: ProjectRequest):
    return {"status": "ok"}

@router.get("/system/stats")
async def get_stats():
    return {"users": 1, "projects": 0, "status": "optimal"}

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Myriox API Root"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
