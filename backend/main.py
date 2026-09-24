import traceback
import os
import json
from io import BytesIO

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI(title="CropGuard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

client = genai.Client(
    api_key=API_KEY,
    vertexai=False
) if API_KEY else None


def build_prompt(growth_stage, temperature, humidity, rainfall):
    return f"""
You are CropGuard, an AI-powered agricultural decision-support assistant.

Analyze the uploaded crop image.

IMPORTANT:
- Identify the crop yourself from the image.
- Do not assume the crop type.
- Describe only symptoms supported by the image.
- Consider disease, pest damage, physical damage, nutrient stress,
  water stress and environmental stress.
- Environmental data is supporting context, not proof.
- Never present the result as a definitive agricultural diagnosis.
- Give practical, sustainable recommendations.
- Avoid unnecessary pesticide, fertilizer or water use.
- Recommend an agricultural expert when evidence is insufficient
  or the situation may have significant consequences.

Environmental context:
Growth stage: {growth_stage}
Temperature: {temperature} °C
Humidity: {humidity} %
Recent rainfall: {rainfall}

Return ONLY valid JSON in this structure:

{{
  "crop": "string",
  "growth_stage_assessment": "string",
  "visual_symptoms": ["string"],
  "possible_issue": "string",
  "risk_level": "Low | Moderate | High",
  "risk_reason": "string",
  "recommended_actions": ["string"],
  "sustainable_approach": ["string"],
  "expert_help": "string",
  "ai_limitations": ["string"]
}}
"""


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "gemini_configured": bool(API_KEY),
        "model": MODEL,
    }


@app.post("/api/analyze")
async def analyze(
    image: UploadFile = File(...),
    growth_stage: str = Form("Unknown"),
    temperature: float = Form(30),
    humidity: float = Form(70),
    rainfall: str = Form("Unknown"),
):
    if not API_KEY or client is None:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured on the backend."
        )

    allowed = {"image/jpeg", "image/png", "image/jpg"}
    if image.content_type not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, JPEG or PNG image."
        )

    raw = await image.read()

    if len(raw) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image is too large. Please use an image under 10 MB."
        )

    try:
        pil = Image.open(BytesIO(raw)).convert("RGB")
        pil.thumbnail((1200, 1200))

        buffer = BytesIO()
        pil.save(buffer, format="JPEG", quality=85)

        prompt = build_prompt(
            growth_stage,
            temperature,
            humidity,
            rainfall,
        )

        response = client.models.generate_content(
            model=MODEL,
            contents=[
                prompt,
                types.Part.from_bytes(
                    data=buffer.getvalue(),
                    mime_type="image/jpeg",
                ),
            ],
            config=types.GenerateContentConfig(
                temperature=0.2,
                max_output_tokens=1200,
            ),
        )

        text = (response.text or "").strip()

        # Handle accidental markdown JSON fences.
        if text.startswith("```"):
            text = text.replace("```json", "", 1).replace("```", "").strip()

        result = json.loads(text)

        return {
            "success": True,
            "data": result,
            "environment": {
                "growth_stage": growth_stage,
                "temperature": temperature,
                "humidity": humidity,
                "rainfall": rainfall,
            },
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="AI returned an unexpected format. Please try again.",
        )

    except Exception as exc:
        traceback.print_exc()
        message = str(exc)

        if "429" in message or "RESOURCE_EXHAUSTED" in message:
            raise HTTPException(
                status_code=429,
                detail=(
                    "Gemini quota is exhausted for this API project. "
                    "Use a project/key with available quota."
                ),
            )

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {message}",
        )