import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RiskManagement = ({ marketData, currentPosition }) => {
  const calculateVaR = () => {
    const returns = marketData.slice(1).map((d, i) => (d.close - marketData[i].close) / marketData[i].close);
    const sortedReturns = returns.sort((a, b) => a - b);
    const varIndex = Math.floor(0.05 * sortedReturns.length);
    return -sortedReturns[varIndex] * 100;
  };

  const calculateMaxDrawdown = () => {
    let peak = -Infinity;
    let maxDrawdown = 0;
    
    for (const data of marketData) {
      if (data.close > peak) {
        peak = data.close;
      }
      
      const drawdown = (peak - data.close) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return maxDrawdown * 100;
  };

  const var95 = calculateVaR();
  const maxDrawdown = calculateMaxDrawdown();

  const riskLevel = () => {
    if (var95 > 5 || maxDrawdown > 10) return 'Alto';
    if (var95 > 2 || maxDrawdown > 5) return 'Médio';
    return 'Baixo';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        <p>VaR (95%): {var95.toFixed(2)}%</p>
        <p>Máximo Drawdown: {maxDrawdown.toFixed(2)}%</p>
        <p>Nível de Risco: {riskLevel()}</p>
        {currentPosition && (
          <p>Posição Atual: {currentPosition.size} @ {currentPosition.entryPrice}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskManagement;