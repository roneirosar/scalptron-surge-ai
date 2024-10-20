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
          <div className="grid grid-cols-2 gap-4">
            <p>Capital Final: ${results.finalCapital.toFixed(2)}</p>
            <p>Retorno Total: {results.totalReturn.toFixed(2)}%</p>
            <p>Total de Trades: {results.totalTrades}</p>
            <p>Trades Vencedores: {results.winningTrades}</p>
            <p>Trades Perdedores: {results.losingTrades}</p>
            <p>Win Rate: {results.winRate.toFixed(2)}%</p>
            <p>Profit Factor: {results.profitFactor.toFixed(2)}</p>
            <p>Índice de Sharpe: {results.sharpeRatio.toFixed(2)}</p>
            <p>Máximo Drawdown: {(results.maxDrawdown * 100).toFixed(2)}%</p>
            <p>Expectativa Matemática: ${results.expectancy.toFixed(2)}</p>
          </div>
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Curva de Equity</h4>
            <LineChart width={500} height={300} data={results.equityCurve}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="equity" stroke="#8884d8" />
            </LineChart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BacktestingResults;