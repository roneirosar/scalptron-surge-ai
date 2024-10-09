export const calculateVolatility = (returns) => {
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((sum, sq) => sum + sq, 0) / returns.length;
  return Math.sqrt(variance * 252); // Anualizado
};

export const calculateVaR = (returns, confidence) => {
  const sortedReturns = returns.sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sortedReturns.length);
  return -sortedReturns[index];
};

export const calculateSharpeRatio = (returns) => {
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length);
  const riskFreeRate = 0.02 / 252; // Assumindo uma taxa livre de risco anual de 2%
  return (mean - riskFreeRate) / stdDev * Math.sqrt(252); // Anualizado
};