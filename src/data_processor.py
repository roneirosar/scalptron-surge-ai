import pandas as pd
import numpy as np

def process_data(df):
    # Ensure 'Date' is in datetime format
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Sort DataFrame by date
    df = df.sort_values('Date')
    
    # Calculate returns
    df['Return'] = df['Close'].pct_change()
    
    # Calculate RSI
    df['RSI'] = calculate_rsi(df['Close'])
    
    # Calculate moving averages
    df['SMA_20'] = df['Close'].rolling(window=20).mean()
    df['SMA_50'] = df['Close'].rolling(window=50).mean()
    
    return df

def calculate_rsi(prices, period=14):
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))