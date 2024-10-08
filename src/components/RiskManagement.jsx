import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const RiskManagement = ({ marketData, currentPosition, onRiskMetricsUpdate }) => {
  const [riskMetrics, setRiskMetrics] = useState({
    var: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    volatility: 0
  });
  const [riskTolerance, setRiskTolerance] = useState(0.5);

  useEffect(() => {
    if (marketData && marketData.length > 0) {
      const metrics = calculateRiskMetrics(marketData);
      setRiskMetrics(metrics);
      onRiskMetricsUpdate(metrics);
    }
  }, [marketData, onRiskMetricsUpdate]);

  const calculateRiskMetrics = (data) => {
    const returns = data.slice(1).map((d, i) => (d.close - data[i].close) / data[i].close);
    const var95 = calculateVaR(returns, 0.95);
    const maxDrawdown = calculateMaxDrawdown(data.map(d => d.close));
    const sharpeRatio = calculateSharpeRatio(returns);
    const volatility = calculateVolatility(returns);

    return { var: var95, maxDrawdown, sharpeRatio, volatility };
  };

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
    const adjustedThreshold = 0.02 + (1 - riskTolerance) * 0.03;
    if (varValue > adjustedThreshold || volatility > 0.4) return 'Alto';
    if (varValue > adjustedThreshold * 0.5 || volatility > 0.3) return 'Médio';
    return 'Baixo';
  };

  const getPositionSizeRecommendation = () => {
    const riskLevel = getRiskLevel();
    const baseSize = currentPosition ? currentPosition.size : 0;
    switch (riskLevel) {
      case 'Alto': return baseSize * 0.5;
      case 'Médio': return baseSize * 0.75;
      case 'Baixo': return baseSize * 1.1;
      default: return baseSize;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Risco Avançado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Tolerância ao Risco</Label>
            <Slider
              value={[riskTolerance]}
              onValueChange={(value) => setRiskTolerance(value[0])}
              max={1}
              step={0.01}
            />
          </div>
          <p>VaR (95%): {(riskMetrics.var * 100).toFixed(2)}%</p>
          <p>Máximo Drawdown: {(riskMetrics.maxDrawdown * 100).toFixed(2)}%</p>
          <p>Índice de Sharpe: {riskMetrics.sharpeRatio.toFixed(2)}</p>
          <p>Volatilidade Anualizada: {(riskMetrics.volatility * 100).toFixed(2)}%</p>
          <p>Nível de Risco: {getRiskLevel()}</p>
          <p>Recomendação de Tamanho da Posição: {getPositionSizeRecommendation().toFixed(2)}</p>
          {currentPosition && (
            <p>Posição Atual: {currentPosition.size} @ {currentPosition.entryPrice.toFixed(2)}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskManagement;
