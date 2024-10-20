import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

const DashboardPanel = ({ isAutomatedTradingEnabled, toggleAutomatedTrading, performanceMetrics }) => {
  return (
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
          <div className="flex items-center text-green-500 mb-4">
            <AlertCircle className="mr-2" />
            <span>Trading Automatizado Ativo</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
  );
};

export default DashboardPanel;