import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BacktestingResults = ({ results }) => {
  if (!results) return null;

  return (
    <div className="mt-4">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Resultados do Backtesting</h3>
          <p>Capital Final: ${results.finalCapital.toFixed(2)}</p>
          <p>Retorno Total: {results.totalReturn.toFixed(2)}%</p>
          <p>Total de Trades: {results.totalTrades}</p>
          <p>Win Rate: {results.winRate.toFixed(2)}%</p>
          <p>Índice de Sharpe: {results.sharpeRatio.toFixed(2)}</p>
          <p>Máximo Drawdown: {(results.maxDrawdown * 100).toFixed(2)}%</p>
        </CardContent>
      </Card>
      <div className="mt-4">
        <LineChart width={600} height={300} data={results.results}>
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
    </div>
  );
};

export default BacktestingResults;