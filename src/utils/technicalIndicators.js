export const calculateIndicators = (data) => {
  // Implementação básica de indicadores técnicos
  return data.map(candle => ({
    ...candle,
    sma20: calculateSMA(data, candle.date, 20),
    rsi: calculateRSI(data, candle.date),
    // Adicione mais indicadores conforme necessário
  }));
};

const calculateSMA = (data, currentDate, period) => {
  const index = data.findIndex(candle => candle.date === currentDate);
  if (index < period - 1) return null;
  const slice = data.slice(index - period + 1, index + 1);
  return slice.reduce((sum, candle) => sum + candle.close, 0) / period;
};

const calculateRSI = (data, currentDate, period = 14) => {
  const index = data.findIndex(candle => candle.date === currentDate);
  if (index < period) return null;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = index - period + 1; i <= index; i++) {
    const change = data[i].close - data[i-1].close;
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};