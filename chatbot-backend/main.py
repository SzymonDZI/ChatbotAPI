import os
from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Załaduj zmienne środowiskowe
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("Brak klucza API. Dodaj GEMINI_API_KEY do pliku .env")

# Konfiguracja Gemini AI
genai.configure(api_key=API_KEY)

app = FastAPI()

# Dodanie obsługi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Możesz zmienić na np. ["http://localhost:3000"] dla większego bezpieczeństwa
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model zapytania
class AIRequest(BaseModel):
    prompt: str

@app.post("/chat")  # Usunięto ukośnik na końcu
async def generate_text(request: AIRequest):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(request.prompt)
        return {"response": response.text}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def home():
    return {"message": "API działa poprawnie 🚀"}

# Uruchamianie serwera
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)