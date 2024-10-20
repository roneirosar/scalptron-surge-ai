import { prepareData, createSequences, makePrediction } from './lstmUtils';
import { calculateIndicators } from './technicalIndicators';
import { calculateVolatility, calculateVaR, calculateSharpeRatio } from './riskCalculations';

const assessRisk = (historicalData, signals, prediction) => {
  const returns = historicalData.slice(1).map((d, i) => (d.close - historicalData[i].close) / historicalData[i].close);
  const volatility = calculateVolatility(returns);
  const var95 = calculateVaR(returns, 0.95);
  const sharpeRatio = calculateSharpeRatio(returns);
  
  const rsi = historicalData[historicalData.length - 1].rsi;
  const adx = historicalData[historicalData.length - 1].adx;

  if (volatility > 0.02 || var95 > 0.03 || rsi > 70 || rsi < 30 || adx < 20) return 'High';
  if (volatility > 0.01 || var95 > 0.02 || (rsi > 60 || rsi < 40) || adx < 25) return 'Medium';
  return 'Low';
};

export const runBacktest = async (marketData, lstmModel, params) => {
  const results = [];
  let capital = params.initialCapital;
  let position = null;
  let totalTrades = 0;
  let winningTrades = 0;
  let losingTrades = 0;
  let totalProfit = 0;
  let totalLoss = 0;

  const filteredData = marketData.filter(d => 
    new Date(d.date) >= new Date(params.startDate) && 
    new Date(d.date) <= new Date(params.endDate)
  );

  const dataWithIndicators = calculateIndicators(filteredData);

  const { normalizedData, dataMean, dataStd } = prepareData(dataWithIndicators, ['close', 'volume', 'rsi', 'macd', 'atr', 'adx']);
  const sequenceLength = 60;

  for (let i = sequenceLength; i < dataWithIndicators.length; i++) {
    const historicalData = dataWithIndicators.slice(0, i);
    const lastSequence = normalizedData.slice([i - sequenceLength, 0], [sequenceLength, -1]).reshape([1, sequenceLength, 6]);
    const prediction = makePrediction(lstmModel, lastSequence, dataStd, dataMean);
    
    const currentPrice = dataWithIndicators[i].close;
    const riskLevel = assessRisk(historicalData, [], prediction);

    if (!position && prediction > currentPrice * (1 + params.entryThreshold / 100) && riskLevel !== 'High') {
      // Comprar
      const riskAmount = capital * (params.maxRiskPerTrade / 100);
      const positionSize = Math.min(riskAmount / (currentPrice * params.stopLoss / 100), capital / currentPrice);
      position = { 
        type: 'long', 
        entryPrice: currentPrice, 
        size: positionSize, 
        stopLoss: currentPrice * (1 - params.stopLoss / 100), 
        takeProfit: currentPrice * (1 + params.takeProfit / 100),
        trailingStop: currentPrice * (1 - params.trailingStop / 100)
      };
      capital -= positionSize * currentPrice;
      totalTrades++;
    } else if (position) {
      // Verificar saída
      if (currentPrice <= position.stopLoss || currentPrice >= position.takeProfit) {
        // Fechar posição
        const profit = (currentPrice - position.entryPrice) * position.size;
        capital += position.size * currentPrice;
        if (profit > 0) {
          winningTrades++;
          totalProfit += profit;
        } else {
          losingTrades++;
          totalLoss += Math.abs(profit);
        }
        position = null;
      } else if (params.trailingStop > 0) {
        // Atualizar trailing stop
        const newTrailingStop = currentPrice * (1 - params.trailingStop / 100);
        if (newTrailingStop > position.trailingStop) {
          position.trailingStop = newTrailingStop;
          position.stopLoss = Math.max(position.stopLoss, newTrailingStop);
        }
        if (currentPrice <= position.trailingStop) {
          // Fechar posição pelo trailing stop
          const profit = (currentPrice - position.entryPrice) * position.size;
          capital += position.size * currentPrice;
          if (profit > 0) {
            winningTrades++;
            totalProfit += profit;
          } else {
            losingTrades++;
            totalLoss += Math.abs(profit);
          }
          position = null;
        }
      }
    }

    results.push({
      date: dataWithIndicators[i].date,
      price: currentPrice,
      prediction: prediction,
      capital: capital + (position ? position.size * currentPrice : 0),
      riskLevel: riskLevel
    });
  }

  const finalCapital = capital + (position ? position.size * dataWithIndicators[dataWithIndicators.length - 1].close : 0);
  const totalReturn = (finalCapital / params.initialCapital - 1) * 100;
  const winRate = (winningTrades / totalTrades) * 100;
  const profitFactor = totalProfit / totalLoss;
  const sharpeRatio = calculateSharpeRatio(results.map(r => r.capital));
  const maxDrawdown = calculateMaxDrawdown(results.map(r => r.capital));

  return {
    results,
    finalCapital,
    totalReturn,
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    profitFactor,
    sharpeRatio,
    maxDrawdown,
    equityCurve: results.map(r => ({ date: r.date, equity: r.capital })),
    drawdownCurve: calculateDrawdownCurve(results.map(r => r.capital))
  };
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

const calculateDrawdownCurve = (capitalHistory) => {
  let peak = capitalHistory[0];
  return capitalHistory.map((capital, i) => {
    if (capital > peak) {
      peak = capital;
    }
    const drawdown = (peak - capital) / peak;
    return { date: i, drawdown: drawdown * 100 };
  });
};