import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BacktestingResults = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resultados do Backtesting</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nenhum resultado de backtesting disponível.</p>
        </CardContent>
      </Card>
    );
  }

  const cumulativeReturns = results.map((result, index) => ({
    trade: index + 1,
    return: result.cumulativeReturn
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados do Backtesting</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p>Total de trades: {results.length}</p>
          <p>Retorno total: {(results[results.length - 1].cumulativeReturn * 100).toFixed(2)}%</p>
          <p>Win rate: {(results.filter(r => r.profit > 0).length / results.length * 100).toFixed(2)}%</p>
        </div>
        <LineChart width={500} height={300} data={cumulativeReturns}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="trade" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="return" stroke="#8884d8" />
        </LineChart>
      </CardContent>
    </Card>
  );
};

export default BacktestingResults;