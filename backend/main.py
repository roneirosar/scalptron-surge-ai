import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from market_data_fetcher import fetch_market_data
from data_processor import process_data
from backend.signal_generator import generate_signals  # Updated import
from ml_model import predict_market_movement
from risk_manager import assess_risk
from sentiment_analyzer import get_market_sentiment

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/market-data")
async def get_market_data():
    try:
        raw_data = await fetch_market_data()
        processed_data = process_data(raw_data)
        signals = generate_signals(processed_data)
        prediction = predict_market_movement(processed_data)
        risk_assessment = assess_risk(processed_data, signals, prediction)
        market_sentiment = get_market_sentiment()
        
        return {
            "market_data": processed_data.to_dict(orient="records"),
            "signals": signals.to_dict(orient="records"),
            "prediction": prediction,
            "risk_assessment": risk_assessment,
            "market_sentiment": market_sentiment
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
