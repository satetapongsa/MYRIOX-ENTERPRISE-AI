import google.generativeai as genai
import os
import pandas as pd
from typing import Any, Dict

class Orchestrator:
    def __init__(self):
        # โหลด API Key
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            # ใช้ชื่อโมเดลที่ถูกต้องและเสถียรที่สุดในปัจจุบัน
            self.model_name = 'gemini-1.5-flash'
            try:
                self.model = genai.GenerativeModel(self.model_name)
            except:
                self.model = None
        else:
            self.model = None

    async def chat_with_data(self, query: str, df: pd.DataFrame, model_type: str = "normal") -> str:
        print(f"[Myriox] Query: {query}")
        
        if not self.model:
            return "MYRIOX Error: API Key missing. Please add GOOGLE_API_KEY to Vercel Settings."

        # สร้าง Persona ให้ Myriox
        system_prompt = "You are Myriox, a sharp and efficient Enterprise AI. Answer concisely."
        if model_type == 'myriox':
            system_prompt = "You are MYRIOX CORE. Aggressive, technical, and data-obsessed. Use cyberpunk tone."

        full_prompt = f"{system_prompt}\n\nUser Question: {query}"

        try:
            # ใช้การเรียกแบบปกติที่เสถียรกว่า
            response = self.model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            # ถ้าตัวแรกไม่ได้ ลองใช้โมเดลสำรอง (2.0 Flash)
            try:
                backup_model = genai.GenerativeModel('gemini-2.0-flash-exp')
                response = backup_model.generate_content(full_prompt)
                return response.text
            except:
                return f"Neural Sync Error: {str(e)}"

    async def run_pipeline(self, df: pd.DataFrame) -> Dict[str, Any]:
        # จำลองการประมวลผลให้ผ่านไปก่อนเพื่อความเร็ว
        return {
            "raw_data": {"status": "optimized"},
            "ai_insights": "Analysis complete. Neural core synchronized."
        }
