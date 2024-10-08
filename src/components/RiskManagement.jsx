import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RiskManagement = ({ marketData, currentPosition }) => {
  const [riskMetrics, setRiskMetrics] = useState({
    var: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    volatility: 0
  });

  useEffect(() => {
    if (marketData && marketData.length > 0) {
      const returns = marketData.slice(1).map((d, i) => (d.close - marketData[i].close) / marketData[i].close);
      
      // Cálculo do VaR (Value at Risk)
      const var95 = calculateVaR(returns, 0.95);
      
      // Cálculo do Drawdown Máximo
      const maxDrawdown = calculateMaxDrawdown(marketData.map(d => d.close));
      
      // Cálculo do Índice de Sharpe
      const sharpeRatio = calculateSharpeRatio(returns);
      
      // Cálculo da Volatilidade
      const volatility = calculateVolatility(returns);

      setRiskMetrics({ var: var95, maxDrawdown, sharpeRatio, volatility });
    }
  }, [marketData]);

  const calculateVaR = (returns, confidence) => {
    const sortedReturns = returns.sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * sortedReturns.length);
    return -sortedReturns[index];
  };

  const calculateMaxDrawdown = (prices) => {
    let maxDrawdown = 0;
    let peak = prices[0];
    
    for (const price of prices) {
      if (price > peak) {
        peak = price;
      }
      const drawdown = (peak - price) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  };

  const calculateSharpeRatio = (returns) => {
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    return (avgReturn / stdDev) * Math.sqrt(252); // Anualizado
  };

  const calculateVolatility = (returns) => {
    return Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / returns.length) * Math.sqrt(252); // Anualizado
  };

  const getRiskLevel = () => {
    const { var: varValue, volatility } = riskMetrics;
    if (varValue > 0.03 || volatility > 0.4) return 'Alto';
    if (varValue > 0.02 || volatility > 0.3) return 'Médio';
    return 'Baixo';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Risco Avançado</CardTitle>
      </CardHeader>
      <CardContent>
        <p>VaR (95%): {(riskMetrics.var * 100).toFixed(2)}%</p>
        <p>Máximo Drawdown: {(riskMetrics.maxDrawdown * 100).toFixed(2)}%</p>
        <p>Índice de Sharpe: {riskMetrics.sharpeRatio.toFixed(2)}</p>
        <p>Volatilidade Anualizada: {(riskMetrics.volatility * 100).toFixed(2)}%</p>
        <p>Nível de Risco: {getRiskLevel()}</p>
        {currentPosition && (
          <p>Posição Atual: {currentPosition.size} @ {currentPosition.entryPrice.toFixed(2)}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskManagement;