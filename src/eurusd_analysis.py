import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import MetaTrader5 as mt5
import pandas_ta as ta

# Função para obter e processar dados
def get_data(symbol, timeframe, num_candles):
    if not mt5.initialize():
        print("Inicialização falhou")
        mt5.shutdown()
        return None

    rates = mt5.copy_rates_from_pos(symbol, timeframe, 0, num_candles)
    df = pd.DataFrame(rates)
    df['time'] = pd.to_datetime(df['time'], unit='s')
    df.set_index('time', inplace=True)

    # Calcular indicadores
    df['SMA_rapida'] = ta.sma(df['close'], length=10)
    df['SMA_lenta'] = ta.sma(df['close'], length=30)
    df['RSI'] = ta.rsi(df['close'], length=14)
    macd = ta.macd(df['close'])
    df = pd.concat([df, macd], axis=1)
    bollinger = ta.bbands(df['close'], length=20)
    df = pd.concat([df, bollinger], axis=1)

    # Criar sinais de compra e venda (exemplo simples)
    df['sinal'] = np.where((df['SMA_rapida'] > df['SMA_lenta']) & (df['RSI'] < 70), 1, 0)
    df['sinal'] = np.where((df['SMA_rapida'] < df['SMA_lenta']) & (df['RSI'] > 30), -1, df['sinal'])

    return df

# Função para criar gráfico
def plot_chart(df, ax1, ax2, ax3, title):
    # Gráfico de preços com médias móveis e Bandas de Bollinger
    ax1.plot(df.index, df['close'], label='Preço de Fechamento')
    ax1.plot(df.index, df['SMA_rapida'], label='Média Móvel Rápida')
    ax1.plot(df.index, df['SMA_lenta'], label='Média Móvel Lenta')
    ax1.plot(df.index, df['BBU_20_2.0'], 'r--', label='Banda Superior')
    ax1.plot(df.index, df['BBL_20_2.0'], 'r--', label='Banda Inferior')
    ax1.fill_between(df.index, df['BBU_20_2.0'], df['BBL_20_2.0'], alpha=0.1)
    ax1.scatter(df.index[df['sinal'] == 1], df.loc[df['sinal'] == 1, 'close'], marker='^', color='g', label='Compra')
    ax1.scatter(df.index[df['sinal'] == -1], df.loc[df['sinal'] == -1, 'close'], marker='v', color='r', label='Venda')
    ax1.set_title(title)
    ax1.legend(loc='upper left')
    ax1.grid(True)

    # Gráfico do MACD
    ax2.plot(df.index, df['MACD_12_26_9'], label='MACD')
    ax2.plot(df.index, df['MACDs_12_26_9'], label='Sinal')
    ax2.bar(df.index, df['MACDh_12_26_9'], label='Histograma')
    ax2.set_title('MACD')
    ax2.legend(loc='upper left')
    ax2.grid(True)

    # Gráfico do RSI
    ax3.plot(df.index, df['RSI'], label='RSI')
    ax3.axhline(y=70, color='r', linestyle='--')
    ax3.axhline(y=30, color='g', linestyle='--')
    ax3.set_title('RSI')
    ax3.legend(loc='upper left')
    ax3.grid(True)

# Obter dados para diferentes timeframes
symbol = "EURUSD"
df_daily = get_data(symbol, mt5.TIMEFRAME_D1, 365)  # 1 ano de dados diários
df_4h = get_data(symbol, mt5.TIMEFRAME_H4, 6 * 30 * 24 // 4)  # 6 meses de dados de 4 horas
df_1h = get_data(symbol, mt5.TIMEFRAME_H1, 30 * 24)  # 1 mês de dados de 1 hora
df_5m = get_data(symbol, mt5.TIMEFRAME_M5, 7 * 24 * 12)  # 1 semana de dados de 5 minutos

# Configurar o layout dos gráficos
fig, axes = plt.subplots(4, 3, figsize=(20, 30))
fig.suptitle('Análise EURUSD em Múltiplos Timeframes', fontsize=16)

# Plotar gráficos para cada timeframe
plot_chart(df_daily, axes[0, 0], axes[0, 1], axes[0, 2], 'EURUSD Diário')
plot_chart(df_4h, axes[1, 0], axes[1, 1], axes[1, 2], 'EURUSD 4 Horas')
plot_chart(df_1h, axes[2, 0], axes[2, 1], axes[2, 2], 'EURUSD 1 Hora')
plot_chart(df_5m, axes[3, 0], axes[3, 1], axes[3, 2], 'EURUSD 5 Minutos')

plt.tight_layout()
plt.show()

# Encerrar conexão com o MetaTrader5
mt5.shutdown()