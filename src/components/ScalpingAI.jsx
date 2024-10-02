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

const calculateProfit = (entryPrice, exitPrice, action) => {
  const difference = action === 'Buy' ? exitPrice - entryPrice : entryPrice - exitPrice;
  return difference * 100000; // Assuming a standard lot size of 100,000 units
};

// New function to predict trades
const predictTrade = (marketData) => {
  const lastPrice = marketData[marketData.length - 1].price;
  const secondLastPrice = marketData[marketData.length - 2].price;
  const action = lastPrice > secondLastPrice ? 'Buy' : 'Sell';
  const confidence = Math.random(); // Simulated confidence level
  const targetPrice = action === 'Buy' ? lastPrice * (1 + Math.random() * 0.001) : lastPrice * (1 - Math.random() * 0.001);
  
  return { action, confidence, targetPrice };
};

const ScalpingAI = () => {
  const [trades, setTrades] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [winRate, setWinRate] = useState(0);

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 1000, // Fetch every second
  });

  useEffect(() => {
    if (marketData && marketData.length > 1) {
      const prediction = predictTrade(marketData);
      if (prediction.confidence > 0.9) { // Only trade with high confidence
        const newTrade = {
          time: new Date().toISOString(),
          action: prediction.action,
          entryPrice: marketData[marketData.length - 1].price,
          targetPrice: prediction.targetPrice,
          exitPrice: null,
          profit: null,
        };
        setTrades(prevTrades => [...prevTrades, newTrade]);
      }
    }
  }, [marketData]);

  useEffect(() => {
    // Simulate trade closure after 5 seconds
    const timer = setTimeout(() => {
      setTrades(prevTrades => 
        prevTrades.map(trade => {
          if (trade.exitPrice === null) {
            const exitPrice = trade.entryPrice + (Math.random() - 0.5) * 0.0010; // Random price movement
            const profit = calculateProfit(trade.entryPrice, exitPrice, trade.action);
            return { ...trade, exitPrice, profit };
          }
          return trade;
        })
      );
    }, 5000);

    return () => clearTimeout(timer);
  }, [trades]);

  useEffect(() => {
    const closedTrades = trades.filter(trade => trade.exitPrice !== null);
    const totalProfit = closedTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const winningTrades = closedTrades.filter(trade => trade.profit > 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

    setTotalProfit(totalProfit);
    setWinRate(winRate);
  }, [trades]);

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
                {trade.exitPrice && (
                  <span>
                    {' '}- Exit: {trade.exitPrice.toFixed(5)}
                    {' '}- Profit: <span className={trade.profit > 0 ? 'text-green-500' : 'text-red-500'}>
                      ${trade.profit.toFixed(2)}
                    </span>
                  </span>
                )}
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
          <p>Trades fechados: {trades.filter(trade => trade.exitPrice !== null).length}</p>
          <p>Win rate: {winRate.toFixed(2)}%</p>
          <p>Lucro/Perda total: ${totalProfit.toFixed(2)}</p>
          <p>Média de lucro por trade: ${(totalProfit / trades.length || 0).toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScalpingAI;