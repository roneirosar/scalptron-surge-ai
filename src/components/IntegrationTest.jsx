import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { runBacktest } from '../utils/backtestingUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const IntegrationTest = ({ marketData, lstmModel }) => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testParams, setTestParams] = useState({
    scenario: 'bullish',
    duration: 30,
    volatility: 'medium',
    initialCapital: 10000,
  });

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setTestParams(prev => ({ ...prev, [name]: name === 'initialCapital' ? Number(value) : value }));
  };

  const generateTestData = (params) => {
    // Simular dados de mercado com base nos parâmetros de teste
    const data = [];
    let price = 100;
    for (let i = 0; i < params.duration; i++) {
      const trend = params.scenario === 'bullish' ? 0.001 : -0.001;
      const volatility = params.volatility === 'high' ? 0.02 : params.volatility === 'medium' ? 0.01 : 0.005;
      const change = trend + (Math.random() - 0.5) * volatility;
      price *= (1 + change);
      data.push({
        date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        close: price,
        volume: Math.floor(Math.random() * 1000000) + 500000,
      });
    }
    return data;
  };

  const runIntegrationTest = async () => {
    setIsRunning(true);
    const testData = generateTestData(testParams);
    const results = await runBacktest(testData, lstmModel, {
      startDate: testData[0].date,
      endDate: testData[testData.length - 1].date,
      initialCapital: testParams.initialCapital,
      maxRiskPerTrade: 1,
      stopLoss: 2,
      takeProfit: 3,
      trailingStop: 1,
      entryThreshold: 0.5,
    });
    setTestResults(results);
    setIsRunning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teste de Integração</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="scenario">Cenário</Label>
            <Select
              id="scenario"
              name="scenario"
              value={testParams.scenario}
              onValueChange={(value) => handleParamChange({ target: { name: 'scenario', value } })}
            >
              <option value="bullish">Mercado em Alta</option>
              <option value="bearish">Mercado em Baixa</option>
              <option value="sideways">Mercado Lateral</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="duration">Duração (dias)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={testParams.duration}
              onChange={handleParamChange}
            />
          </div>
          <div>
            <Label htmlFor="volatility">Volatilidade</Label>
            <Select
              id="volatility"
              name="volatility"
              value={testParams.volatility}
              onValueChange={(value) => handleParamChange({ target: { name: 'volatility', value } })}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="initialCapital">Capital Inicial</Label>
            <Input
              id="initialCapital"
              name="initialCapital"
              type="number"
              value={testParams.initialCapital}
              onChange={handleParamChange}
            />
          </div>
        </div>
        <Button onClick={runIntegrationTest} disabled={isRunning}>
          {isRunning ? 'Executando...' : 'Executar Teste de Integração'}
        </Button>
        {testResults && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Resultados do Teste</h3>
            <p>Capital Final: ${testResults.finalCapital.toFixed(2)}</p>
            <p>Retorno Total: {testResults.totalReturn.toFixed(2)}%</p>
            <p>Total de Trades: {testResults.totalTrades}</p>
            <p>Win Rate: {testResults.winRate.toFixed(2)}%</p>
            <p>Índice Sharpe: {testResults.sharpeRatio.toFixed(2)}</p>
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Curva de Equity</h4>
              <LineChart width={500} height={300} data={testResults.equityCurve}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="equity" stroke="#8884d8" />
              </LineChart>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrationTest;