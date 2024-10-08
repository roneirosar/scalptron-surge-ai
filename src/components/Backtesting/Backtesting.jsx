import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BacktestingForm from './BacktestingForm';
import BacktestingResults from '../BacktestingResults';
import BacktestingCharts from './BacktestingCharts';
import { runBacktest } from '../../utils/backtestingUtils';
import { runMonteCarlo } from '../../utils/monteCarloSimulation';

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

  const handleRunBacktest = async () => {
    setIsRunning(true);
    const results = await runBacktest(marketData, lstmModel, params);
    const monteCarloResults = runMonteCarlo(results, 1000);
    setBacktestResults({ ...results, monteCarloResults });
    setIsRunning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backtesting Aprimorado</CardTitle>
      </CardHeader>
      <CardContent>
        <BacktestingForm params={params} handleParamChange={handleParamChange} />
        <Button onClick={handleRunBacktest} disabled={isRunning}>
          {isRunning ? 'Executando...' : 'Executar Backtest'}
        </Button>
        {backtestResults && (
          <>
            <BacktestingResults results={backtestResults} />
            <BacktestingCharts 
              results={backtestResults.results} 
              monteCarloResults={backtestResults.monteCarloResults} 
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Backtesting;