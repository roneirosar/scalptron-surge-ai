import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar } from 'recharts';

const BacktestingCharts = ({ results, equity, drawdown, monteCarloResults }) => (
  <>
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Curva de Equity</h3>
      <LineChart width={600} height={300} data={equity}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="equity" stroke="#8884d8" />
      </LineChart>
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Drawdown</h3>
      <AreaChart width={600} height={300} data={drawdown}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="drawdown" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Distribuição de Retornos</h3>
      <BarChart width={600} height={300} data={results.map(r => ({ return: r.return * 100 }))}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="return" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="return" fill="#82ca9d" />
      </BarChart>
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Simulação Monte Carlo</h3>
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