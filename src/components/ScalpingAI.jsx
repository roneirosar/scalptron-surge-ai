import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Simulated market data fetching (replace with real API later)
const fetchMarketData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Array.from({ length: 100 }, (_, i) => ({
        time: new Date(Date.now() - (100 - i) * 1000).toISOString(),
        price: 1.1000 + Math.random() * 0.0050
      })));
    }, 1000);
  });
};

// Simulated AI prediction (replace with real ML model later)
const predictTrade = (data) => {
  const lastPrice = data[data.length - 1].price;
  const prevPrice = data[data.length - 2].price;
  return {
    action: lastPrice > prevPrice ? 'Buy' : 'Sell',
    confidence: Math.random() * 0.5 + 0.5, // 50-100% confidence
    targetPrice: lastPrice * (1 + (Math.random() - 0.5) * 0.002)
  };
};

const ScalpingAI = () => {
  const [trades, setTrades] = useState([]);

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 1000, // Fetch every second
  });

  useEffect(() => {
    if (marketData && marketData.length > 1) {
      const prediction = predictTrade(marketData);
      if (prediction.confidence > 0.9) { // Only trade with high confidence
        setTrades(prevTrades => [...prevTrades, {
          time: new Date().toISOString(),
          action: prediction.action,
          entryPrice: marketData[marketData.length - 1].price,
          targetPrice: prediction.targetPrice
        }]);
      }
    }
  }, [marketData]);

  if (isLoading) return <div>Carregando dados do mercado...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">IA de Scalping Trading</h1>
      
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

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Trades Executados</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {trades.map((trade, index) => (
              <li key={index} className="mb-2">
                <span className={`font-bold ${trade.action === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                  {trade.action}
                </span>
                {' '}at {trade.entryPrice.toFixed(5)} - Target: {trade.targetPrice.toFixed(5)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total de trades: {trades.length}</p>
          <p>Assertividade: Simulada (90%+)</p>
          <p>Lucro/Perda: Simulado</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScalpingAI;