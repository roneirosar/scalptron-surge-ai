import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MarketDataChart from './MarketDataChart';
import TradesList from './TradesList';
import TradingStatistics from './TradingStatistics';

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
      <MarketDataChart marketData={marketData} />
      <TradesList trades={trades} />
      <TradingStatistics trades={trades} totalProfit={totalProfit} winRate={winRate} />
    </div>
  );
};

export default ScalpingAI;