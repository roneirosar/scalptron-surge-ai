import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import MetaTrader5 as mt5

# ... keep existing code (importações e configurações iniciais)

# Após calcular todos os indicadores e antes de criar os gráficos, ajuste o layout
plt.figure(figsize=(20, 15))
plt.subplots_adjust(hspace=0.3, top=0.95, bottom=0.05)

# Gráfico de preços com médias móveis e Bandas de Bollinger
ax1 = plt.subplot2grid((4, 1), (0, 0), rowspan=2)
ax1.plot(df.index, df['close'], label='Preço de Fechamento')
ax1.plot(df.index, df['SMA_rapida'], label='Média Móvel Rápida')
ax1.plot(df.index, df['SMA_lenta'], label='Média Móvel Lenta')
ax1.plot(df.index, df['upper_bb'], 'r--', label='Banda Superior')
ax1.plot(df.index, df['lower_bb'], 'r--', label='Banda Inferior')
ax1.fill_between(df.index, df['upper_bb'], df['lower_bb'], alpha=0.1)
ax1.scatter(df.index[df['sinal'] == 1], df.loc[df['sinal'] == 1, 'close'], marker='^', color='g', label='Compra')
ax1.scatter(df.index[df['sinal'] == -1], df.loc[df['sinal'] == -1, 'close'], marker='v', color='r', label='Venda')
ax1.set_title('EURUSD M5 - Preço, Médias Móveis e Bandas de Bollinger')
ax1.legend(loc='upper left')
ax1.grid(True)

# Gráfico do MACD
ax2 = plt.subplot2grid((4, 1), (2, 0), sharex=ax1)
ax2.plot(df.index, df['macd'], label='MACD')
ax2.plot(df.index, df['signal'], label='Sinal')
ax2.bar(df.index, df['hist'], label='Histograma')
ax2.set_title('MACD')
ax2.legend(loc='upper left')
ax2.grid(True)

# Gráfico do RSI
ax3 = plt.subplot2grid((4, 1), (3, 0), sharex=ax1)
ax3.plot(df.index, df['rsi'], label='RSI')
ax3.axhline(y=70, color='r', linestyle='--')
ax3.axhline(y=30, color='g', linestyle='--')
ax3.set_title('RSI')
ax3.legend(loc='upper left')
ax3.grid(True)

plt.tight_layout()
plt.show()

# ... keep existing code (limpeza e fechamento da conexão com o MetaTrader5)