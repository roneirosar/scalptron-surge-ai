import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketData } from '../utils/apiService';
import { calculateIndicators } from '../utils/technicalIndicators';
import { continuousLearning } from '../utils/lstmUtils';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DashboardPanel from './DashboardPanel';
import MarketDataSection from './MarketDataSection';
import AIAnalysisSection from './AIAnalysisSection';
import TradingSection from './TradingSection';
import AutomatedTrading from './AutomatedTrading';
import PerformanceSection from './PerformanceSection';
import BacktestingSection from './BacktestingSection';
import DetailedDataVisualization from './DetailedDataVisualization';
import IntegrationTest from './IntegrationTest';

const ScalpingAI = () => {
  const [trades, setTrades] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [lstmPrediction, setLstmPrediction] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalProfit: 0,
    winRate: 0,
    totalTrades: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
  });
  const [lstmModel, setLstmModel] = useState(null);
  const [isAutomatedTradingEnabled, setIsAutomatedTradingEnabled] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (marketData && marketData.market_data) {
      const dataWithIndicators = calculateIndicators(marketData.market_data);
      
      const newTrades = marketData.signals ? marketData.signals.map(signal => ({
        time: signal.timestamp,
        action: signal.action,
        price: signal.price,
        reason: signal.reason,
      })) : [];

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
        const totalProfit = trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
        const winningTrades = trades.filter(trade => (trade.profit || 0) > 0);
        const winRate = (winningTrades.length / trades.length) * 100;
        setPerformanceMetrics({
          totalProfit,
          winRate,
          totalTrades: trades.length,
          sharpeRatio: calculateSharpeRatio(trades),
          maxDrawdown: calculateMaxDrawdown(trades),
        });
      }

      // Update market data with new indicators
      marketData.market_data = dataWithIndicators;

      // Continuous learning
      if (lstmModel && (!lastUpdateTime || Date.now() - lastUpdateTime > 3600000)) { // Update every hour
        continuousLearning(lstmModel, dataWithIndicators, (status) => {
          console.log(status);
          toast.info(status);
        })
          .then(updatedModel => {
            setLstmModel(updatedModel);
            setLastUpdateTime(Date.now());
            toast.success('Modelo LSTM atualizado com sucesso!');
          })
          .catch(error => {
            console.error('Erro no aprendizado contínuo:', error);
            toast.error('Erro ao atualizar o modelo LSTM');
          });
      }
    }
  }, [marketData, currentPosition, trades, lstmModel, lastUpdateTime]);

  const toggleAutomatedTrading = () => {
    setIsAutomatedTradingEnabled(!isAutomatedTradingEnabled);
  };

  if (isLoading) return <div>Carregando dados do mercado...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ScalpTron: IA de Scalping Trading</h1>
      
      <DashboardPanel 
        isAutomatedTradingEnabled={isAutomatedTradingEnabled}
        toggleAutomatedTrading={toggleAutomatedTrading}
        performanceMetrics={performanceMetrics}
      />
      
      <Tabs defaultValue="market-data" className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="market-data">Dados do Mercado</TabsTrigger>
          <TabsTrigger value="ai-analysis">Análise da IA</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
        </TabsList>
        <TabsContent value="market-data">
          <MarketDataSection marketData={marketData?.market_data || []} />
          <DetailedDataVisualization marketData={marketData?.market_data || []} />
        </TabsContent>
        <TabsContent value="ai-analysis">
          <AIAnalysisSection
            prediction={marketData?.prediction}
            riskAssessment={marketData?.risk_assessment}
            sentiment={marketData?.market_sentiment}
            marketData={marketData?.market_data || []}
            onPredictionUpdate={setLstmPrediction}
            onModelUpdate={setLstmModel}
          />
        </TabsContent>
        <TabsContent value="trading">
          <TradingSection
            marketData={marketData?.market_data || []}
            lstmPrediction={lstmPrediction}
            riskMetrics={riskMetrics}
            currentPosition={currentPosition}
            onRiskMetricsUpdate={setRiskMetrics}
          />
          <AutomatedTrading
            marketData={marketData?.market_data || []}
            lstmPrediction={lstmPrediction}
            riskMetrics={riskMetrics}
            isEnabled={isAutomatedTradingEnabled}
          />
        </TabsContent>
        <TabsContent value="performance">
          <PerformanceSection trades={trades} performanceMetrics={performanceMetrics} />
          <BacktestingSection marketData={marketData?.market_data || []} lstmModel={lstmModel} />
        </TabsContent>
      </Tabs>
      
      <IntegrationTest marketData={marketData?.market_data || []} lstmModel={lstmModel} />
    </div>
  );
};

export default ScalpingAI;