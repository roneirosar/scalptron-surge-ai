import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';

const BacktestingCharts = ({ results, monteCarloResults }) => (
  <>
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Gráfico de Drawdown</h3>
      <AreaChart width={600} height={300} data={results}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="capital" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Distribuição de Retornos (Monte Carlo)</h3>
      <LineChart width={600} height={300} data={monteCarloResults}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="return" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="frequency" stroke="#82ca9d" />
      </LineChart>
    </div>
  </>
);

export default BacktestingCharts;