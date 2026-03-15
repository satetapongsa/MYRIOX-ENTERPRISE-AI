from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from p_models.chat import ChatRequest
import pandas as pd
import uvicorn

app = FastAPI(title="Myriox API")

# CORS
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
    return {"status": "online", "message": "Myriox Core Standing By"}

@router.post("/ask-ai")
async def ask_ai(request: ChatRequest):
    # Mock response for now as requested to start fresh
    return {"response": "Neural connection established. I am Myriox. How can I assist you today?"}

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Myriox API Root"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
