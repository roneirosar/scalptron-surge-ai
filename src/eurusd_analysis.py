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
fig, axes = plt.subplots(3, 2, figsize=(20, 20))
fig.suptitle('Análise EURUSD em Múltiplos Timeframes', fontsize=16)

# Plotar gráficos
mpf.plot(df_weekly, type='candle', ax=axes[0,0], volume=False, style=style, title='EURUSD Semanal')
mpf.plot(df_daily, type='candle', ax=axes[0,1], volume=False, style=style, title='EURUSD Diário')
mpf.plot(df_4h, type='candle', ax=axes[1,0], volume=False, style=style, title='EURUSD 4 Horas')
mpf.plot(df_1h, type='candle', ax=axes[1,1], volume=False, style=style, title='EURUSD 1 Hora')
mpf.plot(df_5m, type='candle', ax=axes[2,0], volume=False, style=style, title='EURUSD 5 Minutos')

plt.tight_layout()
plt.show()