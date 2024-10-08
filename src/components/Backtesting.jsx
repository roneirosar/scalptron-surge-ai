import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Backtesting = ({ marketData, lstmModel }) => {
  const [backtestResults, setBacktestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runBacktest = async () => {
    setIsRunning(true);
    // Simular um backtest
    const results = [];
    let capital = 10000;
    let position = null;

    for (let i = 100; i < marketData.length; i++) {
      const historicalData = marketData.slice(0, i);
      const prediction = await lstmModel.predict(historicalData);
      const currentPrice = marketData[i].close;

      if (prediction > currentPrice * 1.01 && !position) {
        // Comprar
        position = { type: 'long', entryPrice: currentPrice };
      } else if (prediction < currentPrice * 0.99 && position) {
        // Vender
        const profit = (currentPrice - position.entryPrice) / position.entryPrice;
        capital *= (1 + profit);
        position = null;
      }

      results.push({
        date: marketData[i].date,
        price: currentPrice,
        prediction: prediction,
        capital: capital
      });
    }

    setBacktestResults(results);
    setIsRunning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backtesting</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={runBacktest} disabled={isRunning}>
          {isRunning ? 'Executando...' : 'Executar Backtest'}
        </Button>
        {backtestResults && (
          <div className="mt-4">
            <p>Capital Final: ${backtestResults[backtestResults.length - 1].capital.toFixed(2)}</p>
            <p>Retorno Total: {((backtestResults[backtestResults.length - 1].capital / 10000 - 1) * 100).toFixed(2)}%</p>
            <LineChart width={500} height={300} data={backtestResults}>
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