import { calculateVolatility, calculateVaR, calculateSharpeRatio } from './riskCalculations';

export const assessRisk = (historicalData, currentPosition, marketConditions) => {
  const returns = historicalData.map(d => d.close).pct_change().dropna();
  
  const volatility = calculateVolatility(returns);
  const valueAtRisk = calculateVaR(returns, 0.95);
  const sharpeRatio = calculateSharpeRatio(returns);
  
  const currentPrice = historicalData[historicalData.length - 1].close;
  const rsi = historicalData[historicalData.length - 1].rsi;
  const macd = historicalData[historicalData.length - 1].macd;
  
  let riskScore = 0;
  
  // Avaliação baseada em volatilidade
  if (volatility > 0.03) riskScore += 2;
  else if (volatility > 0.02) riskScore += 1;
  
  // Avaliação baseada em VaR
  if (valueAtRisk > 0.05) riskScore += 2;
  else if (valueAtRisk > 0.03) riskScore += 1;
  
  // Avaliação baseada no Sharpe Ratio
  if (sharpeRatio < 0.5) riskScore += 2;
  else if (sharpeRatio < 1) riskScore += 1;
  
  // Avaliação baseada em indicadores técnicos
  if (rsi > 70 || rsi < 30) riskScore += 1;
  if (macd < 0) riskScore += 1;
  
  // Avaliação baseada na posição atual
  if (currentPosition) {
    const unrealizedPnL = (currentPrice - currentPosition.entryPrice) * currentPosition.size;
    if (unrealizedPnL < -currentPosition.entryPrice * 0.02) riskScore += 1;
  }
  
  // Avaliação baseada nas condições de mercado
  if (marketConditions.volatilityIndex > 25) riskScore += 1;
  if (marketConditions.trendStrength < 20) riskScore += 1;
  
  let riskLevel;
  if (riskScore >= 8) riskLevel = 'Muito Alto';
  else if (riskScore >= 6) riskLevel = 'Alto';
  else if (riskScore >= 4) riskLevel = 'Médio';
  else if (riskScore >= 2) riskLevel = 'Baixo';
  else riskLevel = 'Muito Baixo';
  
  return {
    riskLevel,
    riskScore,
    volatility,
    valueAtRisk,
    sharpeRatio
  };
};

export const calculatePositionSize = (capital, riskPerTrade, stopLoss) => {
  return (capital * riskPerTrade) / stopLoss;
};

export const adjustStopLoss = (currentPrice, entryPrice, atr) => {
  const stopDistance = Math.max(2 * atr, 0.02 * entryPrice);
  return currentPrice - stopDistance;
};

export const shouldClosePosition = (position, currentPrice, riskAssessment) => {
  if (riskAssessment.riskLevel === 'Muito Alto') return true;
  if ((currentPrice - position.entryPrice) / position.entryPrice < -0.05) return true;
  return false;
};

export const dynamicRiskAdjustment = (capital, marketVolatility) => {
  let baseRiskPerTrade = 0.01; // 1% risco base por trade
  
  if (marketVolatility > 0.03) {
    baseRiskPerTrade *= 0.5; // Reduz o risco pela metade em mercados muito voláteis
  } else if (marketVolatility < 0.01) {
    baseRiskPerTrade *= 1.5; // Aumenta o risco em 50% em mercados menos voláteis
  }
  
  return Math.min(baseRiskPerTrade, 0.02); // Limita o risco máximo a 2% do capital
};

export const calculateOptimalLeverage = (sharpeRatio, volatility) => {
  const targetVolatility = 0.15; // 15% volatilidade alvo anual
  return Math.min(targetVolatility / volatility, 3); // Limita a alavancagem máxima a 3x
};