import pandas as pd
import numpy as np

def process_data(df):
    # Ensure 'timestamp' is in datetime format
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Sort DataFrame by timestamp
    df = df.sort_values('timestamp')
    
    # Calculate returns
    df['returns'] = df['close'].pct_change()
    
    # Calculate technical indicators
    df['sma_20'] = df['close'].rolling(window=20).mean()
    df['sma_50'] = df['close'].rolling(window=50).mean()
    df['rsi'] = calculate_rsi(df['close'])
    
    return df

def calculate_rsi(prices, period=14):
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))