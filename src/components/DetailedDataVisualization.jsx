import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Bar, Area } from 'recharts';

const DetailedDataVisualization = ({ marketData }) => {
  if (!marketData?.market_data?.length) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Análise Detalhada do Mercado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Preço e Volume</h3>
            <ComposedChart width={800} height={400} data={marketData.market_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="close" stroke="#8884d8" name="Preço" />
              <Bar yAxisId="right" dataKey="volume" fill="#82ca9d" name="Volume" />
            </ComposedChart>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Indicadores Técnicos</h3>
            <LineChart width={800} height={300} data={marketData.market_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rsi" stroke="#8884d8" name="RSI" />
              <Line type="monotone" dataKey="macd" stroke="#82ca9d" name="MACD" />
            </LineChart>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedDataVisualization;