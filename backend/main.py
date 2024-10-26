import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mt5_manager import mt5_manager
import MetaTrader5 as mt5

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens em desenvolvimento
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/mt5-status")
async def get_mt5_status():
    status = mt5_manager.get_connection_status()
    if not status["connected"]:
        raise HTTPException(status_code=503, detail=status["last_error"])
    return status

@app.get("/market-data/{symbol}")
async def get_market_data(symbol: str, timeframe: str = "M5", num_candles: int = 1000):
    timeframe_map = {
        "M1": mt5.TIMEFRAME_M1,
        "M5": mt5.TIMEFRAME_M5,
        "M15": mt5.TIMEFRAME_M15,
        "M30": mt5.TIMEFRAME_M30,
        "H1": mt5.TIMEFRAME_H1,
        "H4": mt5.TIMEFRAME_H4,
        "D1": mt5.TIMEFRAME_D1,
    }
    
    tf = timeframe_map.get(timeframe, mt5.TIMEFRAME_M5)
    data = mt5_manager.get_market_data(symbol, tf, num_candles)
    
    if data is None:
        raise HTTPException(status_code=503, detail="Failed to get market data")
    
    # Converter dados para formato adequado para o frontend
    market_data = []
    for candle in data:
        market_data.append({
            "time": candle[0],
            "open": candle[1],
            "high": candle[2],
            "low": candle[3],
            "close": candle[4],
            "volume": candle[5],
            "spread": candle[6]
        })
    
    return {
        "market_data": market_data,
        "symbol": symbol,
        "timeframe": timeframe
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)