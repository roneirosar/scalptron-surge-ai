import pandas as pd
import numpy as np
from data_processor import process_data
from signal_generator import generate_signals
from ml_model import predict_market_movement
from risk_manager import assess_risk

def run_backtest(historical_data, initial_capital=10000, risk_per_trade=0.01):
    df = process_data(historical_data)
    df = generate_signals(df)  # Modificado para atribuir o resultado
    
    position = 0
    entry_price = 0
    trades = []
    capital = initial_capital
    trade_size = 0
    
    for i in range(1, len(df)):
        current_price = df['close'].iloc[i]
        prediction = predict_market_movement(df.iloc[:i])
        risk_assessment = assess_risk(df.iloc[:i], df['Signal'].iloc[:i], prediction)
        
        if df['Signal'].iloc[i] == 1 and position == 0 and risk_assessment['risk_level'] != 'High':
            position = 1
            entry_price = current_price
            trade_size = (capital * risk_per_trade) / current_price
        elif df['Signal'].iloc[i] == -1 and position == 1:
            position = 0
            exit_price = current_price
            profit = (exit_price - entry_price) * trade_size
            capital += profit
            trades.append({
                'entry_time': df.index[i-1],
                'exit_time': df.index[i],
                'entry_price': entry_price,
                'exit_price': exit_price,
                'profit': profit,
                'trade_size': trade_size
            })
    
    return trades, capital

def calculate_performance_metrics(trades, initial_capital):
    if not trades:
        return None
    
    df_trades = pd.DataFrame(trades)
    df_trades['return'] = df_trades['profit'] / initial_capital
    df_trades['cumulative_return'] = (1 + df_trades['return']).cumprod() - 1
    
    total_return = df_trades['cumulative_return'].iloc[-1]
    sharpe_ratio = df_trades['return'].mean() / df_trades['return'].std() * np.sqrt(252) if df_trades['return'].std() != 0 else 0
    sortino_ratio = df_trades['return'].mean() / df_trades[df_trades['return'] < 0]['return'].std() * np.sqrt(252) if len(df_trades[df_trades['return'] < 0]) > 0 and df_trades[df_trades['return'] < 0]['return'].std() != 0 else 0
    max_drawdown = (df_trades['cumulative_return'] + 1).cummax().sub(df_trades['cumulative_return'] + 1).max()
    profit_factor = df_trades[df_trades['profit'] > 0]['profit'].sum() / abs(df_trades[df_trades['profit'] < 0]['profit'].sum()) if df_trades[df_trades['profit'] < 0]['profit'].sum() != 0 else float('inf')
    expectancy = df_trades['profit'].mean()
    avg_trade_duration = (df_trades['exit_time'] - df_trades['entry_time']).mean().total_seconds() / 60 if len(df_trades) > 0 else 0
    
    return {
        'total_return': total_return,
        'sharpe_ratio': sharpe_ratio,
        'sortino_ratio': sortino_ratio,
        'max_drawdown': max_drawdown,
        'profit_factor': profit_factor,
        'expectancy': expectancy,
        'avg_trade_duration': avg_trade_duration
    }

def backtest_strategy(historical_data, initial_capital=10000):
    trades, final_capital = run_backtest(historical_data, initial_capital)
    performance_metrics = calculate_performance_metrics(trades, initial_capital)
    return trades, final_capital, performance_metrics
