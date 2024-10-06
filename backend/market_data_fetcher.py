import aiohttp
import pandas as pd
from datetime import datetime, timedelta

async def fetch_market_data():
    # Simulated API endpoint - replace with actual data source
    url = "https://api.example.com/market-data"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
    
    # Convert to DataFrame and add timestamp
    df = pd.DataFrame(data)
    df['timestamp'] = pd.date_range(end=datetime.now(), periods=len(df), freq='1min')
    return df