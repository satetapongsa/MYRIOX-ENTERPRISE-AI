import google.generativeai as genai
import os
import pandas as pd
from typing import Any, Dict

class Orchestrator:
    def __init__(self):
        # โหลด API Key จากตัวแปรระบบ
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            # ใช้โมเดลที่เสถียรและเร็วที่สุด
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            print("--- [Myriox] Neural Core: ONLINE ---")
        else:
            self.model = None
            print("--- [Myriox] Neural Core: API KEY MISSING ---")

    async def chat_with_data(self, query: str, df: pd.DataFrame = None, model_type: str = "myriox") -> str:
        if not self.model:
            return "Neural Connection Error: API Key is missing. Please configure GEMINI_API_KEY in the environment."

        # ตั้งค่าบุคลิกภาพ (Persona)
        system_instruction = (
            "You are MYRIOX CORE, a highly advanced Enterprise AI. "
            "Your personality is: Technical, minimalist, sharp, and data-driven. "
            "You speak like a neural link system. No polite fluff. "
            "If user starts with a greeting, acknowledge with 'Neural link established' or 'Core ready'. "
            "ALWAYS answer in the user's language (Thai or English)."
        )

        full_prompt = f"System: {system_instruction}\n\nUser: {query}"

        try:
            # เรียกใช้ AI (แบบ Async)
            response = self.model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            return f"Neural Error: Unable to process request. Reason: {str(e)}"

    async def run_pipeline(self, df: pd.DataFrame):
        # โครงสร้างสำหรับอนาคตในการวิเคราะห์ข้อมูล
        return {"status": "optimal", "insight": "Ready for deep analysis."}
