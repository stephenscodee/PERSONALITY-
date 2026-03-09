from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI(title="Personality Detector API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
MODEL_PATH = "backend/model/saved/personality_model.joblib"
model = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)

class PredictionRequest(BaseModel):
    answers: list[int]

@app.get("/")
def read_root():
    return {"status": "online", "model_loaded": model is not None}

@app.post("/predict")
def predict(request: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please train the model first.")
    
    if len(request.answers) != 15:
        raise HTTPException(status_code=400, detail="Expected 15 answers.")
    
    # Prepare input for prediction
    input_data = np.array(request.answers).reshape(1, -1)
    prediction = model.predict(input_data)[0]
    
    return {
        "openness": float(prediction[0]) * 100,
        "conscientiousness": float(prediction[1]) * 100,
        "extraversion": float(prediction[2]) * 100,
        "agreeableness": float(prediction[3]) * 100,
        "neuroticism": float(prediction[4]) * 100
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
