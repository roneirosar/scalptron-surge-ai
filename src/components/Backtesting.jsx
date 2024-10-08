import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { assess_risk } from '../../backend/risk_manager';
import { prepareData, createSequences, makePrediction } from '../utils/lstmUtils';

const Backtesting = ({ marketData, lstmModel }) => {
  const [backtestResults, setBacktestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runBacktest = async () => {
    setIsRunning(true);
    const results = [];
    let capital = 10000;
    let position = null;
    let totalTrades = 0;
    let winningTrades = 0;

    const { normalizedData, dataMean, dataStd } = prepareData(marketData, ['close', 'volume', 'rsi', 'macd']);
    const sequenceLength = 60;

    for (let i = sequenceLength; i < marketData.length; i++) {
      const historicalData = marketData.slice(0, i);
      const lastSequence = normalizedData.slice([i - sequenceLength, 0], [sequenceLength, -1]).reshape([1, sequenceLength, 4]);
      const prediction = makePrediction(lstmModel, lastSequence, dataStd, dataMean);
      
      const currentPrice = marketData[i].close;
      const riskAssessment = assess_risk(historicalData, [], prediction);

      if (prediction > currentPrice * 1.01 && !position && riskAssessment.risk_level !== 'High') {
        // Comprar
        const positionSize = Math.min(capital * riskAssessment.kelly_fraction, capital * 0.1); // Limitar a 10% do capital
        position = { type: 'long', entryPrice: currentPrice, size: positionSize / currentPrice };
        capital -= positionSize;
        totalTrades++;
      } else if ((prediction < currentPrice * 0.99 || riskAssessment.risk_level === 'High') && position) {
        // Vender
        const profit = (currentPrice - position.entryPrice) * position.size;
        capital += position.size * currentPrice;
        if (profit > 0) winningTrades++;
        position = null;
        totalTrades++;
      }

      results.push({
        date: marketData[i].date,
        price: currentPrice,
        prediction: prediction,
        capital: capital,
        riskLevel: riskAssessment.risk_level
      });
    }

    const finalReturn = (capital / 10000 - 1) * 100;
    const winRate = (winningTrades / totalTrades) * 100;
    const sharpeRatio = calculateSharpeRatio(results.map(r => r.capital));

    setBacktestResults({
      results,
      finalCapital: capital,
      totalReturn: finalReturn,
      totalTrades,
      winRate,
      sharpeRatio
    });
    setIsRunning(false);
  };

  const calculateSharpeRatio = (capitalHistory) => {
    const returns = capitalHistory.map((capital, i) => 
      i === 0 ? 0 : (capital - capitalHistory[i-1]) / capitalHistory[i-1]
    );
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    return (avgReturn / stdDev) * Math.sqrt(252); // Anualizado
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backtesting Aprimorado</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={runBacktest} disabled={isRunning}>
          {isRunning ? 'Executando...' : 'Executar Backtest'}
        </Button>
        {backtestResults && (
          <div className="mt-4">
            <p>Capital Final: ${backtestResults.finalCapital.toFixed(2)}</p>
            <p>Retorno Total: {backtestResults.totalReturn.toFixed(2)}%</p>
            <p>Total de Trades: {backtestResults.totalTrades}</p>
            <p>Win Rate: {backtestResults.winRate.toFixed(2)}%</p>
            <p>Índice de Sharpe: {backtestResults.sharpeRatio.toFixed(2)}</p>
            <LineChart width={500} height={300} data={backtestResults.results}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="price" stroke="#8884d8" name="Preço" />
              <Line yAxisId="left" type="monotone" dataKey="prediction" stroke="#82ca9d" name="Previsão" />
              <Line yAxisId="right" type="monotone" dataKey="capital" stroke="#ffc658" name="Capital" />
            </LineChart>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Backtesting;