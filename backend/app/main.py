from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pandas as pd
import io
import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env explicitly for agents to pick up keys
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

from .models import schemas
from .database import engine, get_db
from ml_engine.processor import MLEngine
from agents.orchestrator import Orchestrator

# Initialize database
schemas.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wavy Analytica Enterprise API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = Orchestrator()

class ChatRequest(BaseModel):
    query: str
    dataset_id: int

@app.get("/")
async def health_check():
    return {
        "status": "operational",
        "version": "1.0.0-enterprise",
        "engine": "NeuralEngine-v4"
    }

@app.post("/chat")
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    # 1. Get Dataset from DB
    dataset = db.query(schemas.Dataset).filter(schemas.Dataset.id == request.dataset_id).first()
    # For demo/testing: If no dataset exists, we continue with empty context
    
    try:
        # Mocking getting the DF for the chat context
        df = pd.DataFrame({"dummy": [1,2,3]}) # Fallback
        
        response = await orchestrator.chat_with_data(request.query, df)
        return {"response": response}
    except Exception as e:
        return {"response": f"Chat failed: {str(e)}"}

@app.post("/datasets/upload")
async def upload_dataset(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    # 1. Read file
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content)) if file.filename.endswith('.csv') else pd.read_json(io.BytesIO(content))
    
    # 2. Save metadata to DB
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
    
    # 3. Start background analysis
    background_tasks.add_task(process_analysis, dataset.id, df, db)
    
    return {"id": dataset.id, "status": "processing"}

async def process_analysis(dataset_id: int, df: pd.DataFrame, db: Session):
    # Run AI Agents
    results = await orchestrator.run_pipeline(df)
    
    # Save insights
    insight = schemas.Insight(
        dataset_id=dataset_id,
        type="full_analytical_scan",
        content=results["raw_data"],
        summary=results["ai_insights"]
    )
    db.add(insight)
    
    # Update dataset status
    dataset = db.query(schemas.Dataset).filter(schemas.Dataset.id == dataset_id).first()
    dataset.status = "ready"
    db.commit()

@app.get("/datasets/{dataset_id}/insights")
async def get_insights(dataset_id: int, db: Session = Depends(get_db)):
    insights = db.query(schemas.Insight).filter(schemas.Insight.dataset_id == dataset_id).all()
    if not insights:
        raise HTTPException(status_code=404, detail="Insights not found or still processing")
    return insights

@app.get("/system/stats")
async def get_stats(db: Session = Depends(get_db)):
    dataset_count = db.query(schemas.Dataset).count()
    insight_count = db.query(schemas.Insight).count()
    return {
        "total_datasets": dataset_count,
        "total_insights_generated": insight_count,
        "active_jobs": 0 # Simulation
    }

@app.get("/chat/sessions")
async def get_chat_sessions(project_id: int = None, db: Session = Depends(get_db)):
    query = db.query(schemas.ChatSession)
    if project_id:
        query = query.filter(schemas.ChatSession.project_id == project_id)
    return query.order_by(schemas.ChatSession.created_at.desc()).all()

@app.post("/chat/sessions")
async def create_chat_session(session: dict, db: Session = Depends(get_db)):
    try:
        db_session = schemas.ChatSession(
            id=session["id"],
            title=session["title"],
            project_id=session.get("project_id")
        )
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        return db_session
    except Exception as e:
        print(f"DB Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/chat/sessions/{session_id}")
async def update_chat_session(session_id: str, updates: dict, db: Session = Depends(get_db)):
    db_session = db.query(schemas.ChatSession).filter(schemas.ChatSession.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    if "title" in updates:
        db_session.title = updates["title"]
    db.commit()
    db.refresh(db_session)
    return db_session

@app.get("/projects")
async def get_projects(db: Session = Depends(get_db)):
    return db.query(schemas.Project).order_by(schemas.Project.created_at.desc()).all()

@app.post("/projects")
async def create_project(project: dict, db: Session = Depends(get_db)):
    db_project = schemas.Project(
        title=project["title"],
        description=project.get("description", "")
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.patch("/projects/{project_id}")
async def update_project(project_id: int, updates: dict, db: Session = Depends(get_db)):
    db_project = db.query(schemas.Project).filter(schemas.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    if "title" in updates:
        db_project.title = updates["title"]
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/projects/{project_id}")
async def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(schemas.Project).filter(schemas.Project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
    return {"status": "deleted"}

@app.get("/chat/sessions/{session_id}/messages")
async def get_chat_messages(session_id: str, db: Session = Depends(get_db)):
    return db.query(schemas.ChatMessage).filter(schemas.ChatMessage.session_id == session_id).all()

@app.post("/chat/messages")
async def save_chat_message(msg: dict, db: Session = Depends(get_db)):
    db_msg = schemas.ChatMessage(
        session_id=msg["session_id"],
        role=msg["role"],
        content=msg["content"]
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

@app.delete("/chat/sessions/{session_id}")
async def delete_chat_session(session_id: str, db: Session = Depends(get_db)):
    try:
        db_session = db.query(schemas.ChatSession).filter(schemas.ChatSession.id == session_id).first()
        if db_session:
            db.delete(db_session)
            db.commit()
            return {"status": "deleted"}
        raise HTTPException(status_code=404, detail="Session not found in Database")
    except Exception as e:
        print(f"Purge Logic Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database constraint error: {str(e)}")
