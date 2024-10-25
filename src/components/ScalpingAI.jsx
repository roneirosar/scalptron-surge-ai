import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketData } from '../utils/apiService';
import { toast } from "sonner";
import ProjectStatus from './ScalpingAI/ProjectStatus';
import SystemStatus from './ScalpingAI/SystemStatus';
import PerformanceChart from './ScalpingAI/PerformanceChart';
import MetricsPanel from './ScalpingAI/MetricsPanel';
import BacktestingResults from './Backtesting/BacktestingResults';
import DetailedDataVisualization from './DetailedDataVisualization';

const ScalpingAI = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData', selectedSymbol],
    queryFn: () => fetchMarketData(selectedSymbol),
    refetchInterval: 5000,
    retry: 3,
    onError: (error) => {
      toast.error(`Erro ao carregar dados: ${error.message}`);
    }
  });

  const systemStatus = {
    dataCollection: 'completed',
    dataProcessing: 'completed',
    lstmModel: 'in-progress',
    riskManagement: 'in-progress',
    autonomousTrading: 'pending',
    backtesting: 'pending'
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ScalpTron: IA Autônoma de Scalping Trading</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ProjectStatus systemStatus={systemStatus} />
        <SystemStatus isLoading={isLoading} error={error} marketData={marketData} />
      </div>

      {marketData && (
        <>
          <PerformanceChart marketData={marketData} />
          <MetricsPanel marketData={marketData} />
          <DetailedDataVisualization marketData={marketData} />
          {marketData.backtestResults && (
            <BacktestingResults results={marketData.backtestResults} />
          )}
        </>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center text-red-500 p-4">
          Erro ao carregar dados. Por favor, tente novamente.
        </div>
      )}
    </div>
  );
};

export default ScalpingAI;