import { prepareData, createSequences, makePrediction } from './lstmUtils';

const assessRisk = (historicalData, signals, prediction) => {
  // Implementação simplificada da avaliação de risco
  const volatility = calculateVolatility(historicalData.map(d => d.close));
  if (volatility > 0.02) return 'High';
  if (volatility > 0.01) return 'Medium';
  return 'Low';
};

const calculateVolatility = (prices) => {
  const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
  return Math.sqrt(returns.reduce((sum, r) => sum + r * r, 0) / returns.length) * Math.sqrt(252);
};

export const runBacktest = async (marketData, lstmModel, params) => {
  const results = [];
  let capital = params.initialCapital;
  let position = null;
  let totalTrades = 0;
  let winningTrades = 0;

  const filteredData = marketData.filter(d => 
    new Date(d.date) >= new Date(params.startDate) && 
    new Date(d.date) <= new Date(params.endDate)
  );

  const { normalizedData, dataMean, dataStd } = prepareData(filteredData, ['close', 'volume', 'rsi', 'macd']);
  const sequenceLength = 60;

  for (let i = sequenceLength; i < filteredData.length; i++) {
    const historicalData = filteredData.slice(0, i);
    const lastSequence = normalizedData.slice([i - sequenceLength, 0], [sequenceLength, -1]).reshape([1, sequenceLength, 4]);
    const prediction = makePrediction(lstmModel, lastSequence, dataStd, dataMean);
    
    const currentPrice = filteredData[i].close;
    const riskLevel = assessRisk(historicalData, [], prediction);

    if (prediction > currentPrice * 1.01 && !position && riskLevel !== 'High') {
      // Comprar
      const riskAmount = capital * (params.maxRiskPerTrade / 100);
      const positionSize = Math.min(riskAmount / (currentPrice * 0.01), capital * 0.1);
      position = { type: 'long', entryPrice: currentPrice, size: positionSize / currentPrice };
      capital -= positionSize;
      totalTrades++;
    } else if ((prediction < currentPrice * 0.99 || riskLevel === 'High') && position) {
      // Vender
      const profit = (currentPrice - position.entryPrice) * position.size;
      capital += position.size * currentPrice;
      if (profit > 0) winningTrades++;
      position = null;
      totalTrades++;
    }

    results.push({
      date: filteredData[i].date,
      price: currentPrice,
      prediction: prediction,
      capital: capital,
      riskLevel: riskLevel
    });
  }

  const finalReturn = (capital / params.initialCapital - 1) * 100;
  const winRate = (winningTrades / totalTrades) * 100;
  const sharpeRatio = calculateSharpeRatio(results.map(r => r.capital));
  const maxDrawdown = calculateMaxDrawdown(results.map(r => r.capital));

  return {
    results,
    finalCapital: capital,
    totalReturn: finalReturn,
    totalTrades,
    winRate,
    sharpeRatio,
    maxDrawdown
  };
};

const calculateSharpeRatio = (capitalHistory) => {
  const returns = capitalHistory.map((capital, i) => 
    i === 0 ? 0 : (capital - capitalHistory[i-1]) / capitalHistory[i-1]
  );
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
  return (avgReturn / stdDev) * Math.sqrt(252); // Anualizado
};

const calculateMaxDrawdown = (capitalHistory) => {
  let maxDrawdown = 0;
  let peak = capitalHistory[0];
  
  for (const capital of capitalHistory) {
    if (capital > peak) {
      peak = capital;
    }
    const drawdown = (peak - capital) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
};