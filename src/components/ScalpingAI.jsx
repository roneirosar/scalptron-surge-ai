import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketData } from '../utils/apiService';
import MarketDataSection from './MarketDataSection';
import AIAnalysisSection from './AIAnalysisSection';
import TradingSection from './TradingSection';
import PerformanceSection from './PerformanceSection';
import BacktestingSection from './BacktestingSection';
import DetailedDataVisualization from './DetailedDataVisualization';
import AutomatedTrading from './AutomatedTrading';
import IntegrationTest from './IntegrationTest';
import { calculateIndicators } from '../utils/technicalIndicators';
import { continuousLearning } from '../utils/lstmUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const calculateSharpeRatio = (trades) => {
    const returns = trades.map(trade => trade.profit || 0);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    return (avgReturn / stdDev) * Math.sqrt(252); // Anualizado
  };

  const calculateMaxDrawdown = (trades) => {
    let maxDrawdown = 0;
    let peak = 0;
    let capital = 0;

    trades.forEach(trade => {
      capital += trade.profit || 0;
      if (capital > peak) {
        peak = capital;
      }
      const drawdown = (peak - capital) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    return maxDrawdown;
  };

  const toggleAutomatedTrading = () => {
    setIsAutomatedTradingEnabled(!isAutomatedTradingEnabled);
  };

  if (isLoading) return <div>Carregando dados do mercado...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ScalpTron: IA de Scalping Trading</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Painel de Controle
            <Button 
              onClick={toggleAutomatedTrading}
              variant={isAutomatedTradingEnabled ? "destructive" : "default"}
            >
              {isAutomatedTradingEnabled ? "Desativar Trading Automatizado" : "Ativar Trading Automatizado"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAutomatedTradingEnabled && (
            <div className="flex items-center text-green-500">
              <AlertCircle className="mr-2" />
              <span>Trading Automatizado Ativo</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <span>Lucro/Perda Total</span>
                <span className={`text-xl font-bold ${performanceMetrics.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {performanceMetrics.totalProfit >= 0 ? <TrendingUp className="inline mr-2" /> : <TrendingDown className="inline mr-2" />}
                  ${Math.abs(performanceMetrics.totalProfit).toFixed(2)}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <span>Win Rate</span>
                <span className="text-xl font-bold">{performanceMetrics.winRate.toFixed(2)}%</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <span>Total de Trades</span>
                <span className="text-xl font-bold">{performanceMetrics.totalTrades}</span>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
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