import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { calculateVolatility, calculateVaR, calculateSharpeRatio } from '../utils/riskCalculations';

const RiskManagementSystem = ({ marketData, currentPosition, onRiskAssessment }) => {
  const [riskMetrics, setRiskMetrics] = useState({
    volatility: 0,
    valueAtRisk: 0,
    sharpeRatio: 0,
  });
  const [riskTolerance, setRiskTolerance] = useState(50);

  useEffect(() => {
    if (marketData && marketData.length > 0) {
      const prices = marketData.map(d => d.close);
      const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
      
      const volatility = calculateVolatility(returns);
      const valueAtRisk = calculateVaR(returns, 0.95);
      const sharpeRatio = calculateSharpeRatio(returns);

      setRiskMetrics({ volatility, valueAtRisk, sharpeRatio });
      
      const riskAssessment = assessRisk(volatility, valueAtRisk, sharpeRatio, riskTolerance);
      onRiskAssessment(riskAssessment);
    }
  }, [marketData, riskTolerance, onRiskAssessment]);

  const assessRisk = (volatility, valueAtRisk, sharpeRatio, tolerance) => {
    const riskScore = (volatility * 0.3 + valueAtRisk * 0.4 - sharpeRatio * 0.3) * (tolerance / 50);
    
    if (riskScore > 0.7) return 'Alto';
    if (riskScore > 0.3) return 'Médio';
    return 'Baixo';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sistema de Gerenciamento de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
          
          <div>
            <p>Volatilidade: {(riskMetrics.volatility * 100).toFixed(2)}%</p>
            <p>Value at Risk (95%): {(riskMetrics.valueAtRisk * 100).toFixed(2)}%</p>
            <p>Índice Sharpe: {riskMetrics.sharpeRatio.toFixed(2)}</p>
          </div>
          
          {currentPosition && (
            <div>
              <p>Posição Atual: {currentPosition.size} @ {currentPosition.entryPrice.toFixed(2)}</p>
              <p>Lucro/Perda: {((marketData[marketData.length - 1].close - currentPosition.entryPrice) * currentPosition.size).toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskManagementSystem;