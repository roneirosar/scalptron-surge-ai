import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const MarketDataChart = ({ marketData }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Dados do Mercado em Tempo Real</CardTitle>
    </CardHeader>
    <CardContent>
      <LineChart width={600} height={300} data={marketData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
      </LineChart>
    </CardContent>
  </Card>
);

export default MarketDataChart;