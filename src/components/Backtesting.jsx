import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { assess_risk } from '../../backend/risk_manager';
import { prepareData, createSequences, makePrediction } from '../utils/lstmUtils';
import BacktestingResults from './BacktestingResults';
import { runMonteCarlo } from '../utils/monteCarloSimulation';

const Backtesting = ({ marketData, lstmModel }) => {
  const [backtestResults, setBacktestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [params, setParams] = useState({
    startDate: '',
    endDate: '',
    initialCapital: 10000,
    maxRiskPerTrade: 1,
  });

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: name === 'initialCapital' || name === 'maxRiskPerTrade' ? Number(value) : value }));
  };

  const runBacktest = async () => {
    setIsRunning(true);
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
      const riskAssessment = assess_risk(historicalData, [], prediction);

      if (prediction > currentPrice * 1.01 && !position && riskAssessment.risk_level !== 'High') {
        // Comprar
        const riskAmount = capital * (params.maxRiskPerTrade / 100);
        const positionSize = Math.min(riskAmount / (currentPrice * 0.01), capital * 0.1);
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
        date: filteredData[i].date,
        price: currentPrice,
        prediction: prediction,
        capital: capital,
        riskLevel: riskAssessment.risk_level
      });
    }

    const finalReturn = (capital / params.initialCapital - 1) * 100;
    const winRate = (winningTrades / totalTrades) * 100;
    const sharpeRatio = calculateSharpeRatio(results.map(r => r.capital));
    const maxDrawdown = calculateMaxDrawdown(results.map(r => r.capital));

    const monteCarloResults = runMonteCarlo(results, 1000);

    setBacktestResults({
      results,
      finalCapital: capital,
      totalReturn: finalReturn,
      totalTrades,
      winRate,
      sharpeRatio,
      maxDrawdown,
      monteCarloResults
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backtesting Aprimorado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="startDate">Data de Início</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={params.startDate}
              onChange={handleParamChange}
            />
          </div>
          <div>
            <Label htmlFor="endDate">Data de Fim</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={params.endDate}
              onChange={handleParamChange}
            />
          </div>
          <div>
            <Label htmlFor="initialCapital">Capital Inicial</Label>
            <Input
              id="initialCapital"
              name="initialCapital"
              type="number"
              value={params.initialCapital}
              onChange={handleParamChange}
            />
          </div>
          <div>
            <Label htmlFor="maxRiskPerTrade">Risco Máximo por Trade (%)</Label>
            <Slider
              id="maxRiskPerTrade"
              name="maxRiskPerTrade"
              min={0.1}
              max={5}
              step={0.1}
              value={[params.maxRiskPerTrade]}
              onValueChange={(value) => setParams(prev => ({ ...prev, maxRiskPerTrade: value[0] }))}
            />
            <span>{params.maxRiskPerTrade.toFixed(1)}%</span>
          </div>
        </div>
        <Button onClick={runBacktest} disabled={isRunning}>
          {isRunning ? 'Executando...' : 'Executar Backtest'}
        </Button>
        {backtestResults && (
          <div className="mt-4">
            <BacktestingResults results={backtestResults} />
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Gráfico de Drawdown</h3>
              <AreaChart width={600} height={300} data={backtestResults.results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="capital" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Distribuição de Retornos (Monte Carlo)</h3>
              <LineChart width={600} height={300} data={backtestResults.monteCarloResults}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="return" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="frequency" stroke="#82ca9d" />
              </LineChart>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Backtesting;