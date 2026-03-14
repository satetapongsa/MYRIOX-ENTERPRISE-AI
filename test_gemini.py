import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print("Listing models:")
for m in genai.list_models():
  if 'generateContent' in m.supported_generation_methods:
    print(m.name)
