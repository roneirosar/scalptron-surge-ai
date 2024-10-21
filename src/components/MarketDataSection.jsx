import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react';

const MarketDataSection = ({ marketData }) => {
  if (!marketData || marketData.length === 0) {
    return (
      <Card>
        <CardContent>
          <p>Nenhum dado de mercado disponível no momento.</p>
        </CardContent>
      </Card>
    );
  }

  const latestData = marketData[marketData.length - 1];
  const previousData = marketData[marketData.length - 2];
  const priceChange = latestData.close - previousData.close;
  const priceChangePercentage = (priceChange / previousData.close) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Preço Atual</p>
              <p className="text-2xl font-bold">${latestData.close.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Variação</p>
              <p className={`text-2xl font-bold ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
              </p>
            </div>
            {priceChange >= 0 ? <TrendingUp className="h-8 w-8 text-green-500" /> : <TrendingDown className="h-8 w-8 text-red-500" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Variação %</p>
              <p className={`text-2xl font-bold ${priceChangePercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {priceChangePercentage >= 0 ? '+' : ''}{priceChangePercentage.toFixed(2)}%
              </p>
            </div>
            {priceChangePercentage >= 0 ? <TrendingUp className="h-8 w-8 text-green-500" /> : <TrendingDown className="h-8 w-8 text-red-500" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Volume</p>
              <p className="text-2xl font-bold">{latestData.volume.toLocaleString()}</p>
            </div>
            <BarChart2 className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Preços</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="close" stroke="#8884d8" name="Preço de Fechamento" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketDataSection;