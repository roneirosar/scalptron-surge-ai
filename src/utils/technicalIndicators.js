import { ema, bollingerBands, rsi, macd } from 'technicalindicators';

export const calculateIndicators = (data) => {
  const closes = data.map(candle => candle.close);
  const volumes = data.map(candle => candle.volume);

  const sma20 = calculateSMA(closes, 20);
  const ema20 = ema({ period: 20, values: closes });
  const bbands = bollingerBands({ period: 20, values: closes, stdDev: 2 });
  const rsiData = rsi({ period: 14, values: closes });
  const macdData = macd({ fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, values: closes });

  return data.map((candle, index) => ({
    ...candle,
    sma20: sma20[index],
    ema20: ema20[index],
    upperBB: bbands.upperBand[index],
    middleBB: bbands.middleBand[index],
    lowerBB: bbands.lowerBand[index],
    rsi: rsiData[index],
    macd: macdData.MACD[index],
    macdSignal: macdData.signal[index],
    macdHistogram: macdData.histogram[index],
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