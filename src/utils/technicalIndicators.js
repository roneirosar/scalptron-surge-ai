import { EMA, RSI, MACD, BollingerBands } from 'technicalindicators';

export const calculateIndicators = (data) => {
  const closes = data.map(candle => candle.close);
  const volumes = data.map(candle => candle.volume);

  const sma20 = calculateSMA(closes, 20);
  const ema20 = EMA.calculate({period: 20, values: closes});
  const bbands = BollingerBands.calculate({
    period: 20,
    values: closes,
    stdDev: 2
  });
  const rsiData = RSI.calculate({period: 14, values: closes});
  const macdData = MACD.calculate({
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    values: closes
  });

  return data.map((candle, index) => ({
    ...candle,
    sma20: sma20[index],
    ema20: ema20[index],
    upperBB: bbands[index]?.upper,
    middleBB: bbands[index]?.middle,
    lowerBB: bbands[index]?.lower,
    rsi: rsiData[index],
    macd: macdData[index]?.MACD,
    macdSignal: macdData[index]?.signal,
    macdHistogram: macdData[index]?.histogram,
  }));
};

const calculateSMA = (data, period) => {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
};