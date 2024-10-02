import MetaTrader5 as mt5
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import mplfinance as mpf

def get_data(symbol, timeframe, num_candles):
    if not mt5.initialize():
        print("Inicialização falhou")
        mt5.shutdown()
        return None

    rates = mt5.copy_rates_from_pos(symbol, timeframe, 0, num_candles)
    mt5.shutdown()
    df = pd.DataFrame(rates)
    df['time'] = pd.to_datetime(df['time'], unit='s')
    df.set_index('time', inplace=True)
    df = df.rename(columns={'open': 'Open', 'high': 'High', 'low': 'Low', 'close': 'Close', 'tick_volume': 'Volume'})
    return df

# Obter dados para diferentes timeframes
df_weekly = get_data("EURUSD", mt5.TIMEFRAME_W1, 52)  # 1 ano de dados semanais
df_daily = get_data("EURUSD", mt5.TIMEFRAME_D1, 365)  # 1 ano de dados diários
df_4h = get_data("EURUSD", mt5.TIMEFRAME_H4, 6 * 30)  # 6 meses de dados de 4 horas
df_1h = get_data("EURUSD", mt5.TIMEFRAME_H1, 24 * 30)  # 1 mês de dados de 1 hora
df_5m = get_data("EURUSD", mt5.TIMEFRAME_M5, 12 * 24 * 7)  # 1 semana de dados de 5 minutos

# Configurar o estilo dos gráficos
style = mpf.make_mpf_style(base_mpf_style='charles', rc={'font.size': 8})

# Criar uma figura com subplots
fig = plt.figure(figsize=(20, 20))
fig.suptitle('Análise EURUSD em Múltiplos Timeframes', fontsize=16)

# Plotar gráficos
ax1 = fig.add_subplot(3, 2, 1)
mpf.plot(df_weekly, type='candle', ax=ax1, volume=False, style=style, title='EURUSD Semanal')

ax2 = fig.add_subplot(3, 2, 2)
mpf.plot(df_daily, type='candle', ax=ax2, volume=False, style=style, title='EURUSD Diário')

ax3 = fig.add_subplot(3, 2, 3)
mpf.plot(df_4h, type='candle', ax=ax3, volume=False, style=style, title='EURUSD 4 Horas')

ax4 = fig.add_subplot(3, 2, 4)
mpf.plot(df_1h, type='candle', ax=ax4, volume=False, style=style, title='EURUSD 1 Hora')

ax5 = fig.add_subplot(3, 2, 5)
mpf.plot(df_5m, type='candle', ax=ax5, volume=False, style=style, title='EURUSD 5 Minutos')

plt.tight_layout()
plt.show()