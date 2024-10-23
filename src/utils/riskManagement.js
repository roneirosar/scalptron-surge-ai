export const calculatePositionSize = (capital, riskPerTrade, stopLoss, volatility) => {
  // Ajusta o risco baseado na volatilidade
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
  
  // Avaliação baseada em volatilidade
  if (volatility > 0.03) riskScore += 2;
  else if (volatility > 0.02) riskScore += 1;
  
  // Avaliação baseada em VaR
  if (valueAtRisk > 0.05) riskScore += 2;
  else if (valueAtRisk > 0.03) riskScore += 1;
  
  // Avaliação baseada no Sharpe Ratio
  if (sharpeRatio < 0.5) riskScore += 2;
  else if (sharpeRatio < 1) riskScore += 1;
  
  // Avaliação das condições de mercado
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
  return avgReturn / stdDev * Math.sqrt(252); // Anualizado
};