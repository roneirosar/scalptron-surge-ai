import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketData } from '../utils/apiService';
import MarketDataSection from './MarketDataSection';
import AIAnalysisSection from './AIAnalysisSection';
import TradingSection from './TradingSection';
import PerformanceSection from './PerformanceSection';
import BacktestingSection from './BacktestingSection';
import { calculateIndicators } from '../utils/technicalIndicators';

const ScalpingAI = () => {
  const [trades, setTrades] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [lstmPrediction, setLstmPrediction] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [lstmModel, setLstmModel] = useState(null);

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (marketData && marketData.market_data) {
      const dataWithIndicators = calculateIndicators(marketData.market_data);
      
      const newTrades = marketData.signals.map(signal => ({
        time: signal.timestamp,
        action: signal.action,
        price: signal.price,
        reason: signal.reason,
      }));
      setTrades(prevTrades => [...prevTrades, ...newTrades]);
      
      // Update current position
      const lastTrade = newTrades[newTrades.length - 1];
      if (lastTrade) {
        if (lastTrade.action === 'BUY') {
          setCurrentPosition({ size: 1, entryPrice: lastTrade.price });
        } else if (lastTrade.action === 'SELL' && currentPosition) {
          setCurrentPosition(null);
        }
      }

      // Calculate performance metrics
      if (trades.length > 0) {
        const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
        const winningTrades = trades.filter(trade => trade.profit > 0);
        const winRate = (winningTrades.length / trades.length) * 100;
        setPerformanceMetrics({
          totalProfit,
          winRate,
          totalTrades: trades.length,
          // Add more metrics as needed
        });
      }

      // Update market data with new indicators
      marketData.market_data = dataWithIndicators;
    }
  }, [marketData, currentPosition, trades]);

  if (isLoading) return <div>Carregando dados do mercado...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">ScalpTron: IA de Scalping Trading</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketDataSection marketData={marketData?.market_data || []} />
        <AIAnalysisSection
          prediction={marketData?.prediction}
          riskAssessment={marketData?.risk_assessment}
          sentiment={marketData?.market_sentiment}
          marketData={marketData?.market_data || []}
          onPredictionUpdate={setLstmPrediction}
          onModelUpdate={setLstmModel}
        />
      </div>
      <TradingSection
        marketData={marketData?.market_data || []}
        lstmPrediction={lstmPrediction}
        riskMetrics={riskMetrics}
        currentPosition={currentPosition}
        onRiskMetricsUpdate={setRiskMetrics}
      />
      <PerformanceSection trades={trades} performanceMetrics={performanceMetrics} />
      <BacktestingSection marketData={marketData?.market_data || []} lstmModel={lstmModel} />
    </div>
  );
};

export default ScalpingAI;