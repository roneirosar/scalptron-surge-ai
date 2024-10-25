import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketData } from '../utils/apiService';
import { toast } from "sonner";
import ProjectStatus from './ScalpingAI/ProjectStatus';
import SystemStatus from './ScalpingAI/SystemStatus';
import PerformanceChart from './ScalpingAI/PerformanceChart';
import MetricsPanel from './ScalpingAI/MetricsPanel';

const ProjectStatusEnum = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in-progress',
  PENDING: 'pending'
};

const ScalpingAI = () => {
  const [systemStatus] = useState({
    dataCollection: ProjectStatusEnum.COMPLETED,
    dataProcessing: ProjectStatusEnum.COMPLETED,
    lstmModel: ProjectStatusEnum.IN_PROGRESS,
    riskManagement: ProjectStatusEnum.IN_PROGRESS,
    autonomousTrading: ProjectStatusEnum.PENDING,
    backtesting: ProjectStatusEnum.PENDING
  });

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 5000,
  });

  React.useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar dados do mercado");
    }
  }, [error]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ScalpTron: IA Autônoma de Scalping Trading</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ProjectStatus systemStatus={systemStatus} />
        <SystemStatus isLoading={isLoading} error={error} marketData={marketData} />
      </div>

      <PerformanceChart marketData={marketData} />
      <MetricsPanel marketData={marketData} />
    </div>
  );
};

export default ScalpingAI;