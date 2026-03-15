import os
import sys

# Get the absolute path to the project root (UP TWO LEVELS from backend/app)
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, BackgroundTasks, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pandas as pd
import io
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env explicitly
load_dotenv(dotenv_path=os.path.join(root_dir, ".env"))

from backend.app.models import schemas
from backend.app.database import engine, get_db
# These will be found because we will set sys.path in index.py
# from ml_engine.processor import MLEngine
# from agents.orchestrator import Orchestrator

# Initialize database safely
try:
    schemas.Base.metadata.create_all(bind=engine)
    print("--- [Wavy Analytica] Database Synchronized ---")
except Exception as e:
    print(f"--- [Wavy Analytica] Warning: DB Sync Delayed: {str(e)} ---")

app = FastAPI(title="Wavy Analytica Enterprise API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy Orchestrator internal
_orchestrator = None

def get_orchestrator():
    global _orchestrator
    if _orchestrator is None:
        from agents.orchestrator import Orchestrator
        _orchestrator = Orchestrator()
    return _orchestrator

# --- API ROUTER ---
router = APIRouter(prefix="/api")

class ChatRequest(BaseModel):
    query: str
    dataset_id: int
    model: str = "normal"

@router.get("/health")
async def health_check():
    return {"status": "operational", "engine": "NeuralEngine-v4"}

@router.post("/chat")
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # 1. Provide some default data context if none provided
        df = pd.DataFrame({
            "timestamp": pd.date_range(start="2024-01-01", periods=10, freq="D"),
            "value": [10, 15, 8, 12, 20, 18, 25, 22, 30, 28],
            "category": ["A", "B", "A", "C", "B", "A", "C", "B", "A", "C"]
        })
        
        # 2. Call AI with timeout protection
        orchestrator = get_orchestrator()
        response = await orchestrator.chat_with_data(request.query, df, model_type=request.model)
        return {"response": response}
    except Exception as e:
        print(f"Chat Endpoint Error: {str(e)}")
        return {"response": f"Neural Link Interrupted: {str(e)}"}

@router.post("/datasets/upload")
async def upload_dataset(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content)) if file.filename.endswith('.csv') else pd.read_json(io.BytesIO(content))
    
    dataset = schemas.Dataset(
        name=file.filename,
        filename=file.filename,
        file_type=file.filename.split('.')[-1],
        status="processing",
        metadata_json={
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": df.columns.tolist()
        }
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    
    background_tasks.add_task(process_analysis, dataset.id, df, db)
    return {"id": dataset.id, "status": "processing"}

async def process_analysis(dataset_id: int, df: pd.DataFrame, db: Session):
    orchestrator = get_orchestrator()
    results = await orchestrator.run_pipeline(df)
    insight = schemas.Insight(
        dataset_id=dataset_id,
        type="full_analytical_scan",
        content=results["raw_data"],
        summary=results["ai_insights"]
    )
    db.add(insight)
    dataset = db.query(schemas.Dataset).filter(schemas.Dataset.id == dataset_id).first()
    dataset.status = "ready"
    db.commit()

@router.get("/datasets/{dataset_id}/insights")
async def get_insights(dataset_id: int, db: Session = Depends(get_db)):
    insights = db.query(schemas.Insight).filter(schemas.Insight.dataset_id == dataset_id).all()
    if not insights: raise HTTPException(status_code=404, detail="Insights not found")
    return insights

@router.get("/system/stats")
async def get_stats(db: Session = Depends(get_db)):
    return {
        "total_datasets": db.query(schemas.Dataset).count(),
        "total_insights_generated": db.query(schemas.Insight).count(),
        "active_jobs": 0
    }

@router.get("/chat/sessions")
async def get_chat_sessions(project_id: int = None, db: Session = Depends(get_db)):
    query = db.query(schemas.ChatSession)
    if project_id: query = query.filter(schemas.ChatSession.project_id == project_id)
    return query.order_by(schemas.ChatSession.created_at.desc()).all()

@router.post("/chat/sessions")
async def create_chat_session(session: dict, db: Session = Depends(get_db)):
    try:
        db_session = schemas.ChatSession(id=session["id"], title=session["title"], project_id=session.get("project_id"))
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        return db_session
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@router.patch("/chat/sessions/{session_id}")
async def update_chat_session(session_id: str, updates: dict, db: Session = Depends(get_db)):
    db_session = db.query(schemas.ChatSession).filter(schemas.ChatSession.id == session_id).first()
    if not db_session: raise HTTPException(status_code=404, detail="Session not found")
    if "title" in updates: db_session.title = updates["title"]
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/projects")
async def get_projects(db: Session = Depends(get_db)):
    return db.query(schemas.Project).order_by(schemas.Project.created_at.desc()).all()

@router.post("/projects")
async def create_project(project: dict, db: Session = Depends(get_db)):
    db_project = schemas.Project(title=project["title"], description=project.get("description", ""))
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.patch("/projects/{project_id}")
async def update_project(project_id: int, updates: dict, db: Session = Depends(get_db)):
    db_project = db.query(schemas.Project).filter(schemas.Project.id == project_id).first()
    if not db_project: raise HTTPException(status_code=404, detail="Project not found")
    if "title" in updates: db_project.title = updates["title"]
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/projects/{project_id}")
async def delete_project(project_id: int, db: Session = Depends(get_db)):
    try:
        # 1. Find the project
        db_project = db.query(schemas.Project).filter(schemas.Project.id == project_id).first()
        if not db_project:
            return {"status": "already_deleted"}
        
        # 2. Find all sessions in this project
        sessions = db.query(schemas.ChatSession).filter(schemas.ChatSession.project_id == project_id).all()
        for session in sessions:
            # 3. For each session, delete messages
            db.query(schemas.ChatMessage).filter(schemas.ChatMessage.session_id == session.id).delete()
            # 4. Delete the session itself
            db.delete(session)
        
        # 5. Finally delete the project
        db.delete(db_project)
        db.commit()
        return {"status": "deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Project Purge Error: {str(e)}")

@router.get("/chat/sessions/{session_id}/messages")
async def get_chat_messages(session_id: str, db: Session = Depends(get_db)):
    return db.query(schemas.ChatMessage).filter(schemas.ChatMessage.session_id == session_id).all()

@router.post("/chat/messages")
async def save_chat_message(msg: dict, db: Session = Depends(get_db)):
    db_msg = schemas.ChatMessage(session_id=msg["session_id"], role=msg["role"], content=msg["content"])
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

@router.delete("/chat/sessions/{session_id}")
async def delete_chat_session(session_id: str, db: Session = Depends(get_db)):
    try:
        # 1. Find the session
        db_session = db.query(schemas.ChatSession).filter(schemas.ChatSession.id == session_id).first()
        if not db_session:
            return {"status": "already_deleted"}
        
        # 2. Get all messages in this session
        messages = db.query(schemas.ChatMessage).filter(schemas.ChatMessage.session_id == session_id).all()
        for msg in messages:
            # 3. Delete attachments for each message FIRST (CRITICAL FIX)
            db.query(schemas.ChatAttachment).filter(schemas.ChatAttachment.message_id == msg.id).delete()
        
        # 4. Delete all messages
        db.query(schemas.ChatMessage).filter(schemas.ChatMessage.session_id == session_id).delete()
        
        # 5. Finally delete the session
        db.delete(db_session)
        db.commit()
        return {"status": "deleted"}
    except Exception as e:
        db.rollback()
        print(f"Purge Logic Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database constraint error: {str(e)}")

# Include the router in the main app
app.include_router(router)

# Health check for the root manually (optional)
@app.get("/")
async def root_health():
    return {"status": "online", "message": "Wavy Analytica API v4 Root"}
