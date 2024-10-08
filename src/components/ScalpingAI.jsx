import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MarketDataChart from './MarketDataChart';
import TradesList from './TradesList';
import TradingStatistics from './TradingStatistics';
import AIDecisionExplanation from './AIDecisionExplanation';
import MarketSentiment from './MarketSentiment';
import LSTMModel from './LSTMModel';
import RiskManagement from './RiskManagement';
import AutomatedTrading from './AutomatedTrading';
import PerformanceMetrics from './PerformanceMetrics';
import Backtesting from './Backtesting';
import { fetchMarketData } from '../utils/apiService';

const ScalpingAI = () => {
  const [trades, setTrades] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [lstmPrediction, setLstmPrediction] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

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
    }
  }, [marketData, currentPosition, trades]);

  if (isLoading) return <div>Carregando dados do mercado...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">ScalpTron: IA de Scalping Trading</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <MarketDataChart marketData={marketData?.market_data || []} />
          <AIDecisionExplanation 
            prediction={marketData?.prediction}
            riskAssessment={marketData?.risk_assessment}
          />
          <MarketSentiment sentiment={marketData?.market_sentiment} />
        </div>
        <div>
          <LSTMModel 
            marketData={marketData?.market_data || []}
            onPredictionUpdate={setLstmPrediction}
          />
          <RiskManagement 
            marketData={marketData?.market_data || []}
            currentPosition={currentPosition}
            onRiskMetricsUpdate={setRiskMetrics}
          />
          <AutomatedTrading
            marketData={marketData?.market_data || []}
            lstmPrediction={lstmPrediction}
            riskMetrics={riskMetrics}
          />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradesList trades={trades} />
        <div>
          <TradingStatistics trades={trades} />
          <PerformanceMetrics metrics={performanceMetrics} />
        </div>
      </div>
      <div className="mt-6">
        <Backtesting marketData={marketData?.market_data || []} lstmModel={lstmModel} />
      </div>
    </div>
  );
};

export default ScalpingAI;
