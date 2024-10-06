import pandas as pd
import numpy as np

def generate_signals(df):
    df['Signal'] = 0
    
    # Generate signals based on SMA crossover
    df.loc[df['SMA_20'] > df['SMA_50'], 'Signal'] = 1
    df.loc[df['SMA_20'] < df['SMA_50'], 'Signal'] = -1
    
    # Filter signals based on RSI
    df.loc[(df['Signal'] == 1) & (df['RSI'] > 70), 'Signal'] = 0
    df.loc[(df['Signal'] == -1) & (df['RSI'] < 30), 'Signal'] = 0
    
    return df[['timestamp', 'close', 'Signal']]