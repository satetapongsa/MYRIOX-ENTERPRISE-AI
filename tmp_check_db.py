import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

# โหลดค่าจาก .env
load_dotenv()
db_url = os.getenv("DATABASE_URL")

if not db_url:
    print("❌ ไม่พบ DATABASE_URL ในไฟล์ .env")
else:
    try:
        # ลบพารามิเตอร์ sslmode ถ้ามีปัญหา (ถ้าใช้ Supabase มักจะต้องมี ?sslmode=require)
        engine = create_engine(db_url)
        inspector = inspect(engine)
        
        tables = inspector.get_table_names()
        
        print(f"\n--- ฐานข้อมูลที่พบใน Supabase ---")
        if not tables:
            print("ไม่พบ Table ใดๆ ใน Schema 'public'")
        for i, table in enumerate(tables, 1):
            print(f"{i}. {table}")
        print("--------------------------------\n")
            
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาดในการเชื่อมต่อ: {str(e)}")
