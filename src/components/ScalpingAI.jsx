import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MarketDataChart from './MarketDataChart';
import TradesList from './TradesList';
import TradingStatistics from './TradingStatistics';
import AIDecisionExplanation from './AIDecisionExplanation';
import MarketSentiment from './MarketSentiment';
import LSTMModel from './LSTMModel';
import { fetchMarketData } from '../utils/apiService';

const ScalpingAI = () => {
  const [trades, setTrades] = useState([]);

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  useEffect(() => {
    if (marketData && marketData.signals) {
      const newTrades = marketData.signals.map(signal => ({
        time: signal.timestamp,
        action: signal.action,
        price: signal.price,
        reason: signal.reason,
      }));
      setTrades(prevTrades => [...prevTrades, ...newTrades]);
    }
  }, [marketData]);

  if (isLoading) return <div>Carregando dados do mercado...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ScalpTron: IA de Scalping Trading</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MarketDataChart marketData={marketData?.market_data || []} />
        <div>
          <AIDecisionExplanation 
            prediction={marketData?.prediction}
            riskAssessment={marketData?.risk_assessment}
          />
          <MarketSentiment sentiment={marketData?.market_sentiment} />
          <LSTMModel marketData={marketData?.market_data || []} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TradesList trades={trades} />
        <TradingStatistics trades={trades} />
      </div>
    </div>
  );
};

export default ScalpingAI;