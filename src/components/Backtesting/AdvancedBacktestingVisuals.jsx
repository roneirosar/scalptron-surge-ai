import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { CandlestickChart, BarChart2, TrendingUp, TrendingDown } from 'lucide-react';

const AdvancedBacktestingVisuals = ({ results }) => {
  if (!results) return null;

  const monthlyReturns = results.trades.reduce((acc, trade) => {
    const month = new Date(trade.date).toLocaleString('default', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + trade.profit;
    return acc;
  }, {});

  const monthlyData = Object.entries(monthlyReturns).map(([month, profit]) => ({
    month,
    profit
  }));

  const profitDistribution = results.trades.reduce((acc, trade) => {
    const profitRange = Math.floor(trade.profit / 100) * 100;
    acc[profitRange] = (acc[profitRange] || 0) + 1;
    return acc;
  }, {});

  const distributionData = Object.entries(profitDistribution).map(([range, count]) => ({
    range: `${range}-${Number(range) + 100}`,
    count
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Retornos Mensais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={600} height={300} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="profit" fill="#8884d8" name="Lucro Mensal" />
          </BarChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Distribuição de Lucros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={600} height={300} data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" name="Frequência" />
          </BarChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CandlestickChart className="h-5 w-5" />
            Análise de Drawdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart width={600} height={300} data={results.drawdownCurve}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="drawdown" stroke="#ff7300" fill="#ff7300" name="Drawdown %" />
          </AreaChart>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedBacktestingVisuals;