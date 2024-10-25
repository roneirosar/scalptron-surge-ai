import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MetricsPanel = ({ marketData }) => {
  return (
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
  );
};

export default MetricsPanel;