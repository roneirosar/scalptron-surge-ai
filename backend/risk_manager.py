import numpy as np
from scipy import stats

def assess_risk(df, signals, prediction):
    current_price = df['close'].iloc[-1]
    returns = df['close'].pct_change().dropna()
    
    # Calculate Value at Risk (VaR)
    var_95 = calculate_var(returns, 0.95)
    
    # Calculate Conditional Value at Risk (CVaR)
    cvar_95 = calculate_cvar(returns, 0.95)
    
    # Calculate volatility
    price_volatility = returns.std() * np.sqrt(252)  # Annualized
    
    # Calculate Sharpe Ratio
    risk_free_rate = 0.02  # Assume 2% risk-free rate
    sharpe_ratio = calculate_sharpe_ratio(returns, risk_free_rate)
    
    # Assess current market conditions
    market_trend = 'Bullish' if df['SMA_20'].iloc[-1] > df['SMA_50'].iloc[-1] else 'Bearish'
    
    # Calculate Kelly Criterion
    win_rate = signals[signals > 0].count() / signals.count()
    avg_win = signals[signals > 0].mean()
    avg_loss = abs(signals[signals < 0].mean())
    kelly_fraction = calculate_kelly_criterion(win_rate, avg_win, avg_loss)
    
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
        'cvar_95': cvar_95,
        'price_volatility': price_volatility,
        'sharpe_ratio': sharpe_ratio,
        'market_trend': market_trend,
        'kelly_fraction': kelly_fraction
    }

def calculate_var(returns, confidence_level):
    return np.percentile(returns, 100 - confidence_level * 100)

def calculate_cvar(returns, confidence_level):
    var = calculate_var(returns, confidence_level)
    return returns[returns <= var].mean()

def calculate_sharpe_ratio(returns, risk_free_rate):
    excess_returns = returns - risk_free_rate / 252  # Daily risk-free rate
    return np.sqrt(252) * excess_returns.mean() / excess_returns.std()

def calculate_kelly_criterion(win_rate, avg_win, avg_loss):
    return (win_rate / avg_loss) - ((1 - win_rate) / avg_win)