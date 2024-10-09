import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Bar, Area } from 'recharts';

const DetailedDataVisualization = ({ marketData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualização Detalhada dos Dados</CardTitle>
      </CardHeader>
      <CardContent>
        <ComposedChart width={600} height={400} data={marketData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="close" stroke="#8884d8" name="Preço de Fechamento" />
          <Bar yAxisId="right" dataKey="volume" fill="#82ca9d" name="Volume" />
          <Area yAxisId="left" type="monotone" dataKey="sma20" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} name="SMA 20" />
          <Line yAxisId="left" type="monotone" dataKey="ema20" stroke="#ff7300" name="EMA 20" />
        </ComposedChart>
        
        <LineChart width={600} height={300} data={marketData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="upperBB" stroke="#8884d8" name="Banda Superior" />
          <Line type="monotone" dataKey="middleBB" stroke="#82ca9d" name="Banda Média" />
          <Line type="monotone" dataKey="lowerBB" stroke="#ffc658" name="Banda Inferior" />
          <Line type="monotone" dataKey="close" stroke="#ff7300" name="Preço de Fechamento" />
        </LineChart>
        
        <LineChart width={600} height={300} data={marketData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="rsi" stroke="#8884d8" name="RSI" />
        </LineChart>
        
        <LineChart width={600} height={300} data={marketData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="macd" stroke="#8884d8" name="MACD" />
          <Line type="monotone" dataKey="macdSignal" stroke="#82ca9d" name="Sinal MACD" />
          <Bar dataKey="macdHistogram" fill="#ffc658" name="Histograma MACD" />
        </LineChart>
      </CardContent>
    </Card>
  );
};

export default DetailedDataVisualization;