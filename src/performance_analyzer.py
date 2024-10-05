import numpy as np

def analyze_performance(df):
    # Calculate returns for each trade
    df['Trade_Return'] = np.where(df['Signal'] != 0, 
                                  df['Close'].pct_change().shift(-1), 
                                  0)
    
    # Calculate cumulative returns
    df['Cumulative_Return'] = (1 + df['Trade_Return']).cumprod() - 1
    
    # Calculate various performance metrics
    total_return = df['Cumulative_Return'].iloc[-1] * 100
    num_trades = df['Signal'].abs().sum()
    winning_trades = df[df['Trade_Return'] > 0]['Trade_Return'].count()
    losing_trades = df[df['Trade_Return'] < 0]['Trade_Return'].count()
    win_rate = winning_trades / num_trades if num_trades > 0 else 0
    
    avg_win = df[df['Trade_Return'] > 0]['Trade_Return'].mean() if winning_trades > 0 else 0
    avg_loss = df[df['Trade_Return'] < 0]['Trade_Return'].mean() if losing_trades > 0 else 0
    profit_factor = abs(avg_win / avg_loss) if avg_loss != 0 else np.inf
    
    sharpe_ratio = df['Trade_Return'].mean() / df['Trade_Return'].std() if df['Trade_Return'].std() != 0 else 0
    
    return {
        'total_return': total_return,
        'num_trades': num_trades,
        'win_rate': win_rate,
        'profit_factor': profit_factor,
        'sharpe_ratio': sharpe_ratio
    }