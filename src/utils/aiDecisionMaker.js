import { calculateTechnicalIndicators } from './technicalIndicators';
import { assessRisk } from './riskManagement';

export const makeTradeDecision = (marketData) => {
  const latestData = marketData[marketData.length - 1];
  const indicators = calculateTechnicalIndicators(marketData);
  const riskAssessment = assessRisk(marketData, indicators);

  let action = 'HOLD';
  let reason = '';

  if (indicators.rsi < 30 && indicators.macdHistogram > 0 && riskAssessment.riskLevel === 'LOW') {
    action = 'BUY';
    reason = 'RSI indica sobrevendido, MACD é positivo, e o risco é baixo.';
  } else if (indicators.rsi > 70 && indicators.macdHistogram < 0 && riskAssessment.riskLevel === 'LOW') {
    action = 'SELL';
    reason = 'RSI indica sobrecomprado, MACD é negativo, e o risco é baixo.';
  } else {
    reason = 'Condições não ideais para negociação. Mantendo posição.';
  }

  return {
    action,
    reason,
    indicators,
    riskAssessment
  };
};