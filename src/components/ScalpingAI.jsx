import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketData, checkMT5Connection } from '../utils/apiService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import SystemStatusCard from './SystemStatusCard';
import StatusDisplay from './StatusDisplay';
import PerformanceChart from './PerformanceChart';
import MetricsDisplay from './MetricsDisplay';

const ScalpingAI = () => {
  const [systemStatus, setSystemStatus] = useState({
    dataCollection: 'completed',
    dataProcessing: 'completed',
    lstmModel: 'in-progress',
    riskManagement: 'in-progress',
    autonomousTrading: 'pending',
    backtesting: 'pending'
  });

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 5000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000)
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await checkMT5Connection();
      } catch (error) {
        toast.error("Erro na conexão com MT5. Verificando conexão...");
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ScalpTron: IA Autônoma de Scalping Trading</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Status do Projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(systemStatus).map(([key, status]) => (
              <StatusDisplay key={key} title={key} status={status} />
            ))}
          </CardContent>
        </Card>

        <SystemStatusCard 
          isLoading={isLoading}
          error={error}
          marketData={marketData}
        />
      </div>

      {marketData && <PerformanceChart data={marketData} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Otimização do modelo LSTM</li>
              <li>Implementação de estratégias avançadas de risco</li>
              <li>Desenvolvimento do módulo autônomo</li>
              <li>Backtesting e otimização</li>
              <li>Auto-ajuste e aprendizado contínuo</li>
            </ul>
          </CardContent>
        </Card>

        <MetricsDisplay metrics={marketData?.metrics} />

        <Card>
          <CardHeader>
            <CardTitle>Status do Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Acurácia:</span>
                <span>{marketData?.modelMetrics?.accuracy?.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>MSE:</span>
                <span>{marketData?.modelMetrics?.mse?.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Última Atualização:</span>
                <span>{marketData?.modelMetrics?.lastUpdate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScalpingAI;