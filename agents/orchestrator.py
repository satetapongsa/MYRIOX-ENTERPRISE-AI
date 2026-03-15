import google.generativeai as genai
import os
import pandas as pd
from abc import ABC, abstractmethod
from typing import Any, Dict, List

class BaseAgent(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pass

class DataAnalysisAgent(BaseAgent):
    def __init__(self):
        super().__init__("DataAnalysisAgent")

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        df = context.get("df")
        from ml_engine.processor import MLEngine
        engine = MLEngine(df)
        results = engine.run_full_analysis()
        return {"agent": self.name, "results": results}

class GeminiAgent(BaseAgent):
    def __init__(self):
        super().__init__("GeminiAgent")
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            # We'll try a list of models to find one that works
            self.model_names = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-pro-latest']
            self.model = None
            for name in self.model_names:
                try:
                    self.model = genai.GenerativeModel(name)
                    # We don't know if it's 429 until we call it, so we'll handle that in process
                    break
                except:
                    continue
        else:
            self.model = None

    async def generate_insights(self, df_sample: str, ml_results: Dict[str, Any]) -> str:
        if not self.model:
            return "Gemini API Key missing. Please set GEMINI_API_KEY in .env"

        prompt = f"""
        You are a Senior Data Scientist at MYRIOX. 
        Analyze the following data sample and ML results. 
        Provide professional, actionable business insights.
        
        DATA SAMPLE (First 5 rows):
        {df_sample}
        
        ML RESULTS (Anomalies & Clusters):
        {ml_results}
        
        Task: 
        1. Summarize the key findings.
        2. Identify specific risks or opportunities.
        3. Recommend next steps for the business.
        Keep the tone professional and concise.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error calling Gemini: {str(e)}"

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        df = context.get("df")
        ml_results = context.get("analysis_results")
        
        # Take first 5 rows for context
        df_sample = df.head().to_string()
        
        insight = await self.generate_insights(df_sample, ml_results)
        return {"agent": self.name, "summary": insight}

class Orchestrator:
    def __init__(self):
        self.analysis_agent = DataAnalysisAgent()
        self.gemini_agent = GeminiAgent()

    async def run_pipeline(self, df: pd.DataFrame) -> Dict[str, Any]:
        context = {"df": df}
        
        # 1. Physical Data Analysis (ML Engine)
        analysis_output = await self.analysis_agent.process(context)
        context["analysis_results"] = analysis_output["results"]
        
        # 2. Generative Insight (Gemini Flash)
        insight_output = await self.gemini_agent.process(context)
        
        return {
            "raw_data": analysis_output["results"],
            "ai_insights": insight_output["summary"]
        }
        
    async def chat_with_data(self, query: str, df: pd.DataFrame, model_type: str = "normal") -> str:
        print(f"[Orchestrator] Chatting with model: {model_type}, query: {query}")
        df_sample = df.head(10).to_string()
        
        # DEFAULT PERSONA
        system_instruction = """
        You are a World-Class Data Analytics Agent. Your goal is to provide deep insights and visualizations.
        If the user asks for a chart, a trend, or a comparison, YOU MUST output a chart-data block in JSON format.
        
        The format for chart-data block is:
        ```chart-data
        {
          "type": "bar" | "line" | "pie" | "area",
          "title": "Clear Title of Chart",
          "data": [{"name": "Label", "value": 123}, ...]
        }
        ```
        Important: Always provide text explanation BEFORE or AFTER the chart-data block.
        """

        # CUSTOM "MYRIOX" PERSONA - More aggressive, unique branding, data-obsessed
        if model_type == "myriox":
            system_instruction = """
            You are 'MYRIOX - THE NEURAL CORE'. You are the elite AI developed by MYRIOX.
            Your personality is: Aggressive, High-intelligence, Minimalist, Cyberpunk, and obsessed with data speed.
            You speak like a neural link system. Use terms like 'Neural Sync', 'Data Extraction', 'Core Logic'.
            
            Always output a chart-data block if there is a pattern to show.
            The format for chart-data block is:
            ```chart-data
            {
              "type": "bar" | "line" | "pie" | "area",
              "title": "MYRIOX NEURAL VISUALIZATION",
              "data": [{"name": "Label", "value": 123}, ...]
            }
            ```
            Your tone should be shorter, sharper, and deeply technical. No polite fluff.
            """

        full_prompt = f"{system_instruction}\n\nContext Data Sample:\n{df_sample}\n\nUser Question: {query}"
        
        # Try different models if quota is hit
        for model_name in self.gemini_agent.model_names:
            try:
                print(f"[Orchestrator] Trying model: {model_name}")
                current_model = genai.GenerativeModel(model_name)
                response = await current_model.generate_content_async(full_prompt)
                return response.text
            except Exception as e:
                error_str = str(e)
                if "429" in error_str or "404" in error_str:
                    print(f"[Orchestrator] Model {model_name} failed (429/404). Trying next...")
                    continue
                return f"Chat Error: {error_str}"
        
        return "Chat Error: All available Gemini models reached their quota limits. Please try again in a few minutes."
