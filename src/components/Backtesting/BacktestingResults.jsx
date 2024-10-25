import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import AdvancedBacktestingVisuals from './AdvancedBacktestingVisuals';

const BacktestingResults = ({ results }) => {
  if (!results) return null;

  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resultados do Backtesting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Capital Final</p>
              <p className="text-2xl font-bold">${results.finalCapital.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Retorno Total</p>
              <p className="text-2xl font-bold">{results.totalReturn.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Win Rate</p>
              <p className="text-2xl font-bold">{results.winRate.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Profit Factor</p>
              <p className="text-2xl font-bold">{results.profitFactor.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Índice Sharpe</p>
              <p className="text-2xl font-bold">{results.sharpeRatio.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Máx Drawdown</p>
              <p className="text-2xl font-bold">{(results.maxDrawdown * 100).toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Trades</p>
              <p className="text-2xl font-bold">{results.totalTrades}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expectância</p>
              <p className="text-2xl font-bold">${results.expectancy?.toFixed(2) || 'N/A'}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4">Curva de Equity</h4>
            <LineChart width={600} height={300} data={results.equityCurve}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="equity" stroke="#8884d8" name="Equity" />
            </LineChart>
          </div>
        </CardContent>
      </Card>

      <AdvancedBacktestingVisuals results={results} />
    </div>
  );
};

export default BacktestingResults;