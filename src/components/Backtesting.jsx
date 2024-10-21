import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BacktestingForm from './Backtesting/BacktestingForm';
import BacktestingResults from './BacktestingResults';
import BacktestingCharts from './Backtesting/BacktestingCharts';
import { runBacktest } from '../utils/backtestingUtils';
import { runMonteCarlo } from '../utils/monteCarloSimulation';
import { optimizeHyperparameters } from '../utils/lstmUtils';
import { toast } from 'sonner';

const Backtesting = ({ marketData, lstmModel }) => {
  const [backtestResults, setBacktestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [params, setParams] = useState({
    startDate: '',
    endDate: '',
    initialCapital: 10000,
    maxRiskPerTrade: 1,
    stopLoss: 2,
    takeProfit: 3,
    trailingStop: 1,
    entryThreshold: 0.5,
  });

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: ['initialCapital', 'maxRiskPerTrade', 'stopLoss', 'takeProfit', 'trailingStop', 'entryThreshold'].includes(name) ? Number(value) : value }));
  };

  const handleRunBacktest = async () => {
    setIsRunning(true);
    toast.info('Iniciando backtesting...');
    try {
      const results = await runBacktest(marketData, lstmModel, params);
      const monteCarloResults = runMonteCarlo(results.trades, 1000);
      setBacktestResults({ ...results, monteCarloResults });
      toast.success('Backtesting concluído com sucesso!');
    } catch (error) {
      console.error('Erro durante o backtesting:', error);
      toast.error('Erro ao executar o backtesting');
    } finally {
      setIsRunning(false);
    }
  };

  const handleOptimizeParameters = async () => {
    setIsRunning(true);
    toast.info('Iniciando otimização de parâmetros...');
    try {
      const optimizedParams = await optimizeBacktestParameters(marketData, lstmModel);
      setParams(optimizedParams);
      toast.success('Parâmetros otimizados com sucesso!');
    } catch (error) {
      console.error('Erro durante a otimização de parâmetros:', error);
      toast.error('Erro ao otimizar parâmetros');
    } finally {
      setIsRunning(false);
    }
  };

  const optimizeBacktestParameters = async (marketData, lstmModel) => {
    const parameterRanges = {
      maxRiskPerTrade: [0.5, 1, 1.5, 2],
      stopLoss: [1, 2, 3, 4],
      takeProfit: [2, 3, 4, 5],
      trailingStop: [0.5, 1, 1.5, 2],
      entryThreshold: [0.3, 0.5, 0.7, 1]
    };

    let bestParams = params;
    let bestPerformance = -Infinity;

    for (const maxRiskPerTrade of parameterRanges.maxRiskPerTrade) {
      for (const stopLoss of parameterRanges.stopLoss) {
        for (const takeProfit of parameterRanges.takeProfit) {
          for (const trailingStop of parameterRanges.trailingStop) {
            for (const entryThreshold of parameterRanges.entryThreshold) {
              const testParams = {
                ...params,
                maxRiskPerTrade,
                stopLoss,
                takeProfit,
                trailingStop,
                entryThreshold
              };
              const results = await runBacktest(marketData, lstmModel, testParams);
              if (results.sharpeRatio > bestPerformance) {
                bestPerformance = results.sharpeRatio;
                bestParams = testParams;
              }
            }
          }
        }
      }
    }

    return bestParams;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backtesting Avançado</CardTitle>
      </CardHeader>
      <CardContent>
        <BacktestingForm params={params} handleParamChange={handleParamChange} />
        <div className="flex space-x-4 mt-4">
          <Button onClick={handleRunBacktest} disabled={isRunning}>
            {isRunning ? 'Executando...' : 'Executar Backtest'}
          </Button>
          <Button onClick={handleOptimizeParameters} disabled={isRunning}>
            {isRunning ? 'Otimizando...' : 'Otimizar Parâmetros'}
          </Button>
        </div>
        {backtestResults && (
          <>
            <BacktestingResults results={backtestResults} />
            <BacktestingCharts 
              results={backtestResults.trades} 
              equity={backtestResults.equityCurve}
              drawdown={backtestResults.drawdownCurve}
              monteCarloResults={backtestResults.monteCarloResults} 
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Backtesting;