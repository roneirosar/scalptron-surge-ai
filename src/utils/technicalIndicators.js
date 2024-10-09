import { EMA, RSI, MACD, BollingerBands, ATR, StochasticRSI, ADX, PSAR } from 'technicalindicators';

export const calculateIndicators = (data) => {
  const closes = data.map(candle => candle.close);
  const highs = data.map(candle => candle.high);
  const lows = data.map(candle => candle.low);
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
  const atrData = ATR.calculate({
    high: highs,
    low: lows,
    close: closes,
    period: 14
  });
  const stochRSIData = StochasticRSI.calculate({
    values: closes,
    rsiPeriod: 14,
    stochasticPeriod: 14,
    kPeriod: 3,
    dPeriod: 3
  });
  const adxData = ADX.calculate({
    high: highs,
    low: lows,
    close: closes,
    period: 14
  });
  const psarData = PSAR.calculate({
    step: 0.02,
    max: 0.2,
    high: highs,
    low: lows
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
    atr: atrData[index],
    stochRSI_K: stochRSIData[index]?.k,
    stochRSI_D: stochRSIData[index]?.d,
    adx: adxData[index]?.adx,
    plusDI: adxData[index]?.pdi,
    minusDI: adxData[index]?.mdi,
    psar: psarData[index]
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