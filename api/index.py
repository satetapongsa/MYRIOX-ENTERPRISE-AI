import os
import sys

# เพิ่มตำแหน่ง Root ของโปรเจกต์เข้าไปใน sys.path
# เนื่องจากไฟล์นี้อยู่ใน api/index.py เราต้องถอยออกมา 1 ก้าวเพื่อหาโฟลเดอร์ backend
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)

if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

print(f"--- [Myriox] Initializing Neural Engine ---")
print(f"--- [Myriox] Root Dir: {parent_dir} ---")

try:
    # พยายามโหลดแอปหลัก
    from backend.app.main import app
    print("--- [Myriox] API Gateway: ONLINE ---")
except Exception as e:
    print(f"--- [Myriox] API Gateway: CRITICAL ERROR: {str(e)} ---")
    # สร้างแอปจำลองเพื่อแจ้ง Error กลับไปที่หน้าเวบ
    from fastapi import FastAPI
    app = FastAPI()
    @app.get("/api/ask-ai")
    @app.post("/api/ask-ai")
    async def error_report():
        return {"error": f"Backend load failed: {str(e)}"}

# สิ่งสำคัญสำหรับ Vercel Python Runtime
handler = app
