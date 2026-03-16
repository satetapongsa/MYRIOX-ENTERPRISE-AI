import os
import sys

# เพิ่มตำแหน่ง Root
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

try:
    from backend.app.main import app
    # สิ่งสำคัญสำหรับ Vercel
    handler = app
except Exception as e:
    from fastapi import FastAPI
    app = FastAPI()
    @app.api_route("/{path:path}", methods=["GET", "POST"])
    async def catch_all(path: str):
        return {"error": f"Backend boot failed: {str(e)}", "path": path}
    handler = app
