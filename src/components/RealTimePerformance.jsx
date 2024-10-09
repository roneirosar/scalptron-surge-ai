import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RealTimePerformance = ({ performanceMetrics, trades }) => {
  const equityCurve = trades.map((trade, index) => ({
    tradeNumber: index + 1,
    equity: trades.slice(0, index + 1).reduce((sum, t) => sum + (t.profit || 0), 0)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho em Tempo Real</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-semibold">Lucro Total:</p>
            <p>${performanceMetrics.totalProfit.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Taxa de Acerto:</p>
            <p>{performanceMetrics.winRate.toFixed(2)}%</p>
          </div>
          <div>
            <p className="font-semibold">Total de Trades:</p>
            <p>{performanceMetrics.totalTrades}</p>
          </div>
          <div>
            <p className="font-semibold">Índice Sharpe:</p>
            <p>{performanceMetrics.sharpeRatio.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Drawdown Máximo:</p>
            <p>{(performanceMetrics.maxDrawdown * 100).toFixed(2)}%</p>
          </div>
        </div>
        <LineChart width={500} height={300} data={equityCurve}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tradeNumber" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="equity" stroke="#8884d8" name="Curva de Equity" />
        </LineChart>
      </CardContent>
    </Card>
  );
};

export default RealTimePerformance;