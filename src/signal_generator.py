import numpy as np

def generate_signals(df):
    df['Signal'] = 0
    
    # Generate signals based on SMA crossover
    df['Signal'] = np.where(df['SMA_20'] > df['SMA_50'], 1, 0)
    df['Signal'] = df['Signal'].diff()
    
    # Filter signals based on RSI
    df.loc[(df['Signal'] == 1) & (df['RSI'] > 70), 'Signal'] = 0
    df.loc[(df['Signal'] == -1) & (df['RSI'] < 30), 'Signal'] = 0
    
    # Add exit signals
    exit_threshold = 0.01  # 1% profit target
    for i in range(len(df)):
        if df['Signal'].iloc[i] == 1:
            entry_price = df['Close'].iloc[i]
            exit_price = entry_price * (1 + exit_threshold)
            for j in range(i + 1, len(df)):
                if df['High'].iloc[j] >= exit_price:
                    df.loc[j, 'Signal'] = -1
                    break
    
    # Filter out signals that are too close
    min_distance = 0.0010
    for i in range(1, len(df)):
        if df['Signal'].iloc[i] != 0:
            if abs(df['Close'].iloc[i] - df['Close'].iloc[i-1]) < min_distance:
                df.loc[i, 'Signal'] = 0
    
    return df