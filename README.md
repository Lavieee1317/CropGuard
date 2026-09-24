# CropGuard

Premium AgriTech UI + FastAPI + Gemini multimodal AI prototype.

## Architecture

React/Vite frontend -> FastAPI backend -> Gemini multimodal analysis

The API key stays on the backend.

## 1. Backend

Open PowerShell in `backend`:

```powershell
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

If PowerShell blocks activation, do NOT activate the venv; use the `.\venv\Scripts\python.exe` commands above.

## 2. Frontend

Open another terminal in `frontend`:

```powershell
npm install
npm run dev
```

Open the URL shown by Vite.

## 3. Important

A Gemini `429 RESOURCE_EXHAUSTED` response means the API project/key has no available quota. The code cannot bypass that. Use a project/key with available quota.

Never put `GEMINI_API_KEY` in the React frontend.

## MVP flow

Image + growth stage + temperature + humidity + rainfall
-> Gemini multimodal analysis
-> crop identification
-> symptom analysis
-> possible issue
-> qualitative risk
-> sustainable recommendations
-> expert-help guidance
-> AI limitations

This is preliminary decision support, not a definitive agricultural diagnosis.
