import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MarketDataChart from './MarketDataChart';
import TradesList from './TradesList';
import TradingStatistics from './TradingStatistics';
import AIDecisionExplanation from './AIDecisionExplanation';
import AdvancedTradingChart from './AdvancedTradingChart';
import { makeTradeDecision } from '../utils/aiDecisionMaker';
import { fetchMarketData } from '../data/dataFetcher';
import { processMarketData } from '../data/dataProcessor';

const ScalpingAI = () => {
  const [trades, setTrades] = useState([]);
  const [aiDecision, setAiDecision] = useState(null);

  const { data: rawMarketData, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (rawMarketData) {
      const processedData = processMarketData(rawMarketData);
      const decision = makeTradeDecision(processedData);
      setAiDecision(decision);

      if (decision.action !== 'HOLD') {
        const newTrade = {
          time: new Date().toISOString(),
          action: decision.action,
          price: processedData[processedData.length - 1].price,
          reason: decision.reason,
        };
        setTrades(prevTrades => [...prevTrades, newTrade]);
      }
    }
  }, [rawMarketData]);

  if (isLoading) return <div>Carregando dados do mercado...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ScalpTron: IA de Scalping Trading</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdvancedTradingChart marketData={rawMarketData} trades={trades} />
        <AIDecisionExplanation decision={aiDecision} />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TradesList trades={trades} />
        <TradingStatistics trades={trades} />
      </div>
    </div>
  );
};

export default ScalpingAI;