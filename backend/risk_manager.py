import numpy as np
from scipy import stats

def assess_risk(df, signals, prediction, risk_tolerance=0.5):
    current_price = df['close'].iloc[-1]
    returns = df['close'].pct_change().dropna()
    
    var_95 = calculate_var(returns, 0.95)
    cvar_95 = calculate_cvar(returns, 0.95)
    volatility = calculate_volatility(returns)
    max_drawdown = calculate_max_drawdown(df['close'])
    sharpe_ratio = calculate_sharpe_ratio(returns)
    
    # Ajuste dinâmico baseado na tolerância ao risco
    risk_adjustment = 1 + (risk_tolerance - 0.5)
    var_threshold = 0.02 * risk_adjustment
    volatility_threshold = 0.3 * risk_adjustment
    
    if var_95 > var_threshold or volatility > volatility_threshold:
        risk_level = 'High'
    elif var_95 > var_threshold * 0.5 or volatility > volatility_threshold * 0.75:
        risk_level = 'Medium'
    else:
        risk_level = 'Low'
    
    return {
        'risk_level': risk_level,
        'var_95': var_95,
        'cvar_95': cvar_95,
        'volatility': volatility,
        'max_drawdown': max_drawdown,
        'sharpe_ratio': sharpe_ratio
    }

def calculate_var(returns, confidence_level):
    return np.percentile(returns, 100 - confidence_level * 100)

def calculate_cvar(returns, confidence_level):
    var = calculate_var(returns, confidence_level)
    return returns[returns <= var].mean()

def calculate_volatility(returns):
    return returns.std() * np.sqrt(252)  # Anualizado

def calculate_max_drawdown(prices):
    peak = prices.expanding(min_periods=1).max()
    drawdown = (prices - peak) / peak
    return drawdown.min()

def calculate_sharpe_ratio(returns, risk_free_rate=0.02):
    excess_returns = returns - risk_free_rate / 252
    return np.sqrt(252) * excess_returns.mean() / excess_returns.std()

def calculate_position_size(account_balance, risk_per_trade, stop_loss_percent):
    return (account_balance * risk_per_trade) / stop_loss_percent

def calculate_kelly_criterion(win_rate, win_loss_ratio):
    return win_rate - ((1 - win_rate) / win_loss_ratio)