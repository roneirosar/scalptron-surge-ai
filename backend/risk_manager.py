import numpy as np

def assess_risk(df, signals, prediction):
    current_price = df['close'].iloc[-1]
    price_volatility = df['close'].pct_change().std()
    
    # Calculate Value at Risk (VaR)
    returns = df['close'].pct_change().dropna()
    var_95 = np.percentile(returns, 5)
    
    # Assess current market conditions
    market_trend = 'Bullish' if df['SMA_20'].iloc[-1] > df['SMA_50'].iloc[-1] else 'Bearish'
    
    # Determine risk level
    if price_volatility > 0.02 or abs(var_95) > 0.03:
        risk_level = 'High'
    elif price_volatility > 0.01 or abs(var_95) > 0.02:
        risk_level = 'Medium'
    else:
        risk_level = 'Low'
    
    return {
        'risk_level': risk_level,
        'var_95': var_95,
        'price_volatility': price_volatility,
        'market_trend': market_trend
    }