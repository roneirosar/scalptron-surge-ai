import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetchMarketData = async () => {
  // Simulated API call - replace with actual market data API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { time: '09:00', price: 100 },
        { time: '09:01', price: 101 },
        { time: '09:02', price: 99 },
        { time: '09:03', price: 102 },
        { time: '09:04', price: 103 },
      ]);
    }, 1000);
  });
};

const TradingAI = () => {
  const [prediction, setPrediction] = useState(null);

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  useEffect(() => {
    if (marketData) {
      // Simulated AI prediction - replace with actual AI model
      const lastPrice = marketData[marketData.length - 1].price;
      setPrediction(Math.random() > 0.5 ? 'Buy' : 'Sell');
    }
  }, [marketData]);

  if (isLoading) return <div>Carregando dados do mercado...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">IA de Scalping Trading</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Dados do Mercado</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart width={600} height={300} data={marketData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Previsão da IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {prediction === 'Buy' ? (
                <TrendingUp className="h-8 w-8 text-green-500 mr-2" />
              ) : (
                <TrendingUp className="h-8 w-8 text-red-500 mr-2 transform rotate-180" />
              )}
              <span className="text-xl font-bold">{prediction}</span>
            </div>
            <Button>
              Executar Trade
              <DollarSign className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-yellow-500">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>Alta volatilidade detectada. Proceda com cautela.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingAI;