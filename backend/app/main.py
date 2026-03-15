from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from p_models.chat import ChatRequest
from agents.orchestrator import Orchestrator
import pandas as pd
import uvicorn

app = FastAPI(title="Myriox AI API")
orchestrator = Orchestrator()

# CORS configured for Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/api")

@router.get("/health")
async def health():
    return {"status": "online", "engine": "Myriox Neural v4"}

@router.post("/ask-ai")
async def ask_ai(request: ChatRequest):
    try:
        # ใช้ข้อมูลจำลองเพื่อความเร็วและตัดปัญหา DB
        df = pd.DataFrame({"info": ["Myriox System Active"]})
        response = await orchestrator.chat_with_data(request.query, df, request.model_type)
        return {"response": response}
    except Exception as e:
        return {"response": f"Neural Core Error: {str(e)}"}

app.include_router(router)

# สำหรับ Vercel
@app.get("/")
async def root():
    return {"message": "Myriox Business AI Root"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
