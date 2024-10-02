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
    bollinger = ta.bbands(df['close'], length=20)
    df = pd.concat([df, bollinger], axis=1)

    # Criar sinais de compra e venda (exemplo simples)
    df['sinal'] = np.where(df['SMA_rapida'] > df['SMA_lenta'], 1, 0)
    df['sinal'] = np.where(df['SMA_rapida'] < df['SMA_lenta'], -1, df['sinal'])

    return df

# Função para criar gráfico
def plot_chart(df, ax, title):
    ax.plot(df.index, df['close'], label='Preço de Fechamento')
    ax.plot(df.index, df['SMA_rapida'], label='Média Móvel Rápida')
    ax.plot(df.index, df['SMA_lenta'], label='Média Móvel Lenta')
    ax.plot(df.index, df['BBU_20_2.0'], 'r--', label='Banda Superior')
    ax.plot(df.index, df['BBL_20_2.0'], 'r--', label='Banda Inferior')
    ax.fill_between(df.index, df['BBU_20_2.0'], df['BBL_20_2.0'], alpha=0.1)
    ax.scatter(df.index[df['sinal'] == 1], df.loc[df['sinal'] == 1, 'close'], marker='^', color='g', label='Compra')
    ax.scatter(df.index[df['sinal'] == -1], df.loc[df['sinal'] == -1, 'close'], marker='v', color='r', label='Venda')
    ax.set_title(title)
    ax.legend(loc='upper left')
    ax.grid(True)

# Obter dados para diferentes timeframes
symbol = "EURUSD"
df_daily = get_data(symbol, mt5.TIMEFRAME_D1, 365)  # 1 ano de dados diários
df_4h = get_data(symbol, mt5.TIMEFRAME_H4, 6 * 30 * 24 // 4)  # 6 meses de dados de 4 horas
df_1h = get_data(symbol, mt5.TIMEFRAME_H1, 30 * 24)  # 1 mês de dados de 1 hora
df_5m = get_data(symbol, mt5.TIMEFRAME_M5, 7 * 24 * 12)  # 1 semana de dados de 5 minutos

# Configurar o layout dos gráficos
fig, axes = plt.subplots(4, 1, figsize=(20, 30))
fig.suptitle('Análise EURUSD em Múltiplos Timeframes', fontsize=16)

# Plotar gráficos para cada timeframe
plot_chart(df_daily, axes[0], 'EURUSD Diário')
plot_chart(df_4h, axes[1], 'EURUSD 4 Horas')
plot_chart(df_1h, axes[2], 'EURUSD 1 Hora')
plot_chart(df_5m, axes[3], 'EURUSD 5 Minutos')

plt.tight_layout()
plt.show()

# Encerrar conexão com o MetaTrader5
mt5.shutdown()