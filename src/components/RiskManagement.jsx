import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const RiskManagement = ({ marketData, currentPosition, onRiskMetricsUpdate }) => {
  const [riskMetrics, setRiskMetrics] = useState({
    var: 0,
    cvar: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    volatility: 0,
    kellyFraction: 0,
  });
  const [riskTolerance, setRiskTolerance] = useState(50);

  useEffect(() => {
    if (marketData && marketData.length > 0) {
      const returns = marketData.slice(1).map((d, i) => (d.close - marketData[i].close) / marketData[i].close);
      
      const var95 = calculateVaR(returns, 0.95);
      const cvar95 = calculateCVaR(returns, 0.95);
      const maxDrawdown = calculateMaxDrawdown(marketData.map(d => d.close));
      const sharpeRatio = calculateSharpeRatio(returns);
      const volatility = calculateVolatility(returns);
      const kellyFraction = calculateKellyFraction(returns);

      const newRiskMetrics = { var: var95, cvar: cvar95, maxDrawdown, sharpeRatio, volatility, kellyFraction };
      setRiskMetrics(newRiskMetrics);
      onRiskMetricsUpdate(newRiskMetrics);
    }
  }, [marketData, onRiskMetricsUpdate]);

  const calculateVaR = (returns, confidence) => {
    const sortedReturns = returns.sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * sortedReturns.length);
    return -sortedReturns[index];
  };

  const calculateCVaR = (returns, confidence) => {
    const sortedReturns = returns.sort((a, b) => a - b);
    const varIndex = Math.floor((1 - confidence) * sortedReturns.length);
    const cvarReturns = sortedReturns.slice(0, varIndex);
    return -cvarReturns.reduce((sum, r) => sum + r, 0) / cvarReturns.length;
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

  const calculateKellyFraction = (returns) => {
    const winRate = returns.filter(r => r > 0).length / returns.length;
    const avgWin = returns.filter(r => r > 0).reduce((sum, r) => sum + r, 0) / returns.filter(r => r > 0).length;
    const avgLoss = Math.abs(returns.filter(r => r < 0).reduce((sum, r) => sum + r, 0) / returns.filter(r => r < 0).length);
    return winRate - ((1 - winRate) / (avgWin / avgLoss));
  };

  const getRiskLevel = () => {
    const { var: varValue, volatility } = riskMetrics;
    if (varValue > 0.03 || volatility > 0.4) return 'Alto';
    if (varValue > 0.02 || volatility > 0.3) return 'Médio';
    return 'Baixo';
  };

  const getRecommendedPositionSize = () => {
    const riskFactor = riskTolerance / 100;
    const accountSize = 10000; // Exemplo de tamanho da conta
    const riskPerTrade = 0.01 * riskFactor; // 1% do capital ajustado pela tolerância ao risco
    return Math.min((accountSize * riskPerTrade) / riskMetrics.var, accountSize * riskMetrics.kellyFraction);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Risco Avançado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>VaR (95%): {(riskMetrics.var * 100).toFixed(2)}%</p>
          <p>CVaR (95%): {(riskMetrics.cvar * 100).toFixed(2)}%</p>
          <p>Máximo Drawdown: {(riskMetrics.maxDrawdown * 100).toFixed(2)}%</p>
          <p>Índice de Sharpe: {riskMetrics.sharpeRatio.toFixed(2)}</p>
          <p>Volatilidade Anualizada: {(riskMetrics.volatility * 100).toFixed(2)}%</p>
          <p>Fração de Kelly: {(riskMetrics.kellyFraction * 100).toFixed(2)}%</p>
          <p>Nível de Risco: {getRiskLevel()}</p>
          
          <div>
            <Label htmlFor="risk-tolerance">Tolerância ao Risco</Label>
            <Slider
              id="risk-tolerance"
              min={0}
              max={100}
              step={1}
              value={[riskTolerance]}
              onValueChange={(value) => setRiskTolerance(value[0])}
            />
            <span>{riskTolerance}%</span>
          </div>
          
          <p>Tamanho Recomendado da Posição: {getRecommendedPositionSize().toFixed(2)}</p>
          
          {currentPosition && (
            <p>Posição Atual: {currentPosition.size} @ {currentPosition.entryPrice.toFixed(2)}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskManagement;
