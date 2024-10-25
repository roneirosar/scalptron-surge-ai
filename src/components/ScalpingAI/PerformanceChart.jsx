import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PerformanceChart = ({ marketData }) => {
  if (!marketData) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Performance do Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart width={800} height={300} data={marketData?.performance || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="equity" stroke="#8884d8" name="Equity" />
          <Line type="monotone" dataKey="drawdown" stroke="#82ca9d" name="Drawdown" />
        </LineChart>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;