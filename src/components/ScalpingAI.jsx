import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketData } from '../utils/apiService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertCircle, CheckCircle2, Timer } from "lucide-react";

const ProjectStatus = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in-progress',
  PENDING: 'pending'
};

const ScalpingAI = () => {
  const [systemStatus, setSystemStatus] = useState({
    dataCollection: ProjectStatus.COMPLETED,
    dataProcessing: ProjectStatus.COMPLETED,
    lstmModel: ProjectStatus.IN_PROGRESS,
    riskManagement: ProjectStatus.IN_PROGRESS,
    autonomousTrading: ProjectStatus.PENDING,
    backtesting: ProjectStatus.PENDING
  });

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar dados do mercado");
    }
  }, [error]);

  const getStatusIcon = (status) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case ProjectStatus.IN_PROGRESS:
        return <Timer className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 100;
      case ProjectStatus.IN_PROGRESS:
        return 50;
      default:
        return 0;
    }
  };

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
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  {getStatusIcon(status)}
                </div>
                <Progress value={getStatusProgress(status)} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                  Falha ao carregar dados do mercado. Tentando reconectar...
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Conexão com MT5:</span>
                  <span className="text-green-500">Ativo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Última Atualização:</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Trades Hoje:</span>
                  <span>{marketData?.trades?.length || 0}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {marketData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={800} height={300} data={marketData?.performance || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="equity" stroke="#8884d8" name="Equity" />
              <Line type="monotone" dataKey="drawdown" stroke="#82ca9d" name="Drawdown" />
            </LineChart>
          </CardContent>
        </Card>
      )}

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

        <Card>
          <CardHeader>
            <CardTitle>Métricas de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span>{marketData?.metrics?.winRate?.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Profit Factor:</span>
                <span>{marketData?.metrics?.profitFactor?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sharpe Ratio:</span>
                <span>{marketData?.metrics?.sharpeRatio?.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

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