import { calculateTechnicalIndicators } from './technicalIndicators';
import { assessRisk } from './riskManagement';
import { analyzeMarketSentiment } from './sentimentAnalysis';

export const makeTradeDecision = (marketData) => {
  const latestData = marketData[marketData.length - 1];
  const indicators = calculateTechnicalIndicators(marketData);
  const riskAssessment = assessRisk(marketData, indicators);
  const marketSentiment = analyzeMarketSentiment();

  let action = 'HOLD';
  let reason = '';
  let confidence = 0;

  // Lógica de decisão aprimorada
  if (indicators.rsi < 30 && indicators.macdHistogram > 0 && indicators.adx > 25) {
    action = 'BUY';
    reason = 'RSI indica sobrevendido, MACD é positivo, e ADX mostra tendência forte.';
    confidence = 0.7;
  } else if (indicators.rsi > 70 && indicators.macdHistogram < 0 && indicators.adx > 25) {
    action = 'SELL';
    reason = 'RSI indica sobrecomprado, MACD é negativo, e ADX mostra tendência forte.';
    confidence = 0.7;
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
    marketSentiment
  };
};