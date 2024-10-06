import { calculateTechnicalIndicators } from './technicalIndicators';
import { assessRisk } from './riskManagement';
import { analyzeMarketSentiment } from './sentimentAnalysis';

export const makeTradeDecision = (marketData, lstmPrediction) => {
  const latestData = marketData[marketData.length - 1];
  const indicators = calculateTechnicalIndicators(marketData);
  const riskAssessment = assessRisk(marketData, indicators);
  const marketSentiment = analyzeMarketSentiment();

  let action = 'HOLD';
  let reason = '';
  let confidence = 0;

  // Lógica de decisão aprimorada com LSTM
  const priceDifference = lstmPrediction - latestData.close;
  const priceChangePercent = (priceDifference / latestData.close) * 100;

  if (priceChangePercent > 0.1 && indicators.rsi < 70 && indicators.macdHistogram > 0) {
    action = 'BUY';
    reason = 'LSTM prevê aumento de preço, RSI não está sobrecomprado, e MACD é positivo.';
    confidence = 0.8;
  } else if (priceChangePercent < -0.1 && indicators.rsi > 30 && indicators.macdHistogram < 0) {
    action = 'SELL';
    reason = 'LSTM prevê queda de preço, RSI não está sobrevendido, e MACD é negativo.';
    confidence = 0.8;
  }

  // Ajuste baseado no sentimento do mercado
  if (marketSentiment === 'Positive' && action === 'BUY') {
    confidence += 0.1;
  } else if (marketSentiment === 'Negative' && action === 'SELL') {
    confidence += 0.1;
  }

  // Verificação final de risco
  if (riskAssessment.riskLevel === 'HIGH') {
    action = 'HOLD';
    reason = 'Nível de risco muito alto para negociar.';
    confidence = 0.5;
  }

  return {
    action,
    reason,
    confidence,
    indicators,
    riskAssessment,
    marketSentiment,
    lstmPrediction
  };
};