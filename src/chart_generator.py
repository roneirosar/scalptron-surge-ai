import plotly.graph_objects as go

def create_chart(df, performance_metrics, output_file):
    fig = go.Figure()

    # Candlestick chart
    fig.add_trace(go.Candlestick(
        x=df['Date'],
        open=df['Open'],
        high=df['High'],
        low=df['Low'],
        close=df['Close'],
        name='Candlestick'
    ))

    # Add buy and sell signals
    fig.add_trace(go.Scatter(
        x=df.loc[df['Signal'] == 1, 'Date'],
        y=df.loc[df['Signal'] == 1, 'Close'],
        mode='markers',
        name='Buy',
        marker=dict(color='green', size=10, symbol='triangle-up'),
        showlegend=True
    ))
    fig.add_trace(go.Scatter(
        x=df.loc[df['Signal'] == -1, 'Date'],
        y=df.loc[df['Signal'] == -1, 'Close'],
        mode='markers',
        name='Sell',
        marker=dict(color='red', size=10, symbol='triangle-down'),
        showlegend=True
    ))

    # Add moving averages
    fig.add_trace(go.Scatter(
        x=df['Date'],
        y=df['SMA_20'],
        mode='lines',
        name='SMA 20',
        line=dict(color='blue', width=2)
    ))
    fig.add_trace(go.Scatter(
        x=df['Date'],
        y=df['SMA_50'],
        mode='lines',
        name='SMA 50',
        line=dict(color='orange', width=2)
    ))

    # Update layout
    fig.update_layout(
        title=f'Candlestick Chart - Performance: {performance_metrics["total_return"]:.2f}%',
        xaxis_title='Date',
        yaxis_title='Price',
        xaxis_rangeslider_visible=True
    )

    # Save the chart as an interactive HTML file
    fig.write_html(output_file)