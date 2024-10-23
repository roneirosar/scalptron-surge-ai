export const calculatePositionSize = (capital, riskPerTrade, stopLoss, volatility) => {
  const adjustedRisk = riskPerTrade * (1 - volatility);
  return (capital * adjustedRisk) / stopLoss;
};

export const calculateStopLoss = (entryPrice, atr, riskMultiplier = 2) => {
  return entryPrice - (atr * riskMultiplier);
};

export const calculateTakeProfit = (entryPrice, stopLoss, riskRewardRatio = 2) => {
  const risk = Math.abs(entryPrice - stopLoss);
  return entryPrice + (risk * riskRewardRatio);
};

export const assessRisk = (marketData, currentPosition, marketConditions) => {
  const volatility = calculateVolatility(marketData);
  const valueAtRisk = calculateVaR(marketData, 0.95);
  const sharpeRatio = calculateSharpeRatio(marketData);
  
  let riskScore = 0;
  
  if (volatility > 0.03) riskScore += 2;
  else if (volatility > 0.02) riskScore += 1;
  
  if (valueAtRisk > 0.05) riskScore += 2;
  else if (valueAtRisk > 0.03) riskScore += 1;
  
  if (sharpeRatio < 0.5) riskScore += 2;
  else if (sharpeRatio < 1) riskScore += 1;
  
  if (marketConditions.volatilityIndex > 25) riskScore += 1;
  if (marketConditions.trendStrength < 20) riskScore += 1;
  
  return {
    riskLevel: getRiskLevel(riskScore),
    volatility,
    valueAtRisk,
    sharpeRatio,
    riskScore
  };
};

export const dynamicRiskAdjustment = (capital, marketVolatility) => {
  let baseRiskPerTrade = 0.01;
  
  if (marketVolatility > 0.03) {
    baseRiskPerTrade *= 0.5;
  } else if (marketVolatility < 0.01) {
    baseRiskPerTrade *= 1.5;
  }
  
  return Math.min(baseRiskPerTrade, 0.02);
};

export const calculateOptimalLeverage = (sharpeRatio, volatility) => {
  const targetVolatility = 0.15;
  return Math.min(targetVolatility / volatility, 3);
};

export const shouldClosePosition = (position, currentPrice, riskAssessment) => {
  if (riskAssessment.riskLevel === 'Alto') return true;
  if ((currentPrice - position.entryPrice) / position.entryPrice < -0.05) return true;
  return false;
};

const getRiskLevel = (riskScore) => {
  if (riskScore >= 6) return 'Alto';
  if (riskScore >= 3) return 'Médio';
  return 'Baixo';
};

const calculateVolatility = (marketData) => {
  const returns = marketData.slice(1).map((price, i) => 
    (price - marketData[i]) / marketData[i]
  );
  return Math.sqrt(returns.reduce((sum, r) => sum + r * r, 0) / returns.length);
};

const calculateVaR = (marketData, confidence) => {
  const returns = marketData.slice(1).map((price, i) => 
    (price - marketData[i]) / marketData[i]
  );
  const sortedReturns = returns.sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sortedReturns.length);
  return -sortedReturns[index];
};

const calculateSharpeRatio = (marketData) => {
  const returns = marketData.slice(1).map((price, i) => 
    (price - marketData[i]) / marketData[i]
  );
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((sum, r) => 
    sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  );
  return avgReturn / stdDev * Math.sqrt(252);
};