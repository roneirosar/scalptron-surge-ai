import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AutomatedTrading = ({ marketData, lstmPrediction, riskMetrics }) => {
  const [isAutomatedTradingEnabled, setIsAutomatedTradingEnabled] = useState(false);
  const [lastTrade, setLastTrade] = useState(null);
  const [stopLoss, setStopLoss] = useState(2);
  const [takeProfit, setTakeProfit] = useState(3);
  const [maxPositionSize, setMaxPositionSize] = useState(1000);

  useEffect(() => {
    if (isAutomatedTradingEnabled && marketData && lstmPrediction && riskMetrics) {
      const decision = makeTradeDecision(marketData, lstmPrediction, riskMetrics);
      if (decision.action !== 'HOLD') {
        executeTrade(decision);
      }
    }
  }, [isAutomatedTradingEnabled, marketData, lstmPrediction, riskMetrics]);

  const makeTradeDecision = (marketData, prediction, riskMetrics) => {
    const currentPrice = marketData[marketData.length - 1].close;
    const priceChange = (prediction - currentPrice) / currentPrice;
    const riskLevel = getRiskLevel(riskMetrics);

    if (priceChange > 0.01 && riskLevel !== 'Alto') {
      return { 
        action: 'BUY', 
        price: currentPrice, 
        reason: 'Previsão de alta com risco aceitável',
        stopLoss: currentPrice * (1 - stopLoss / 100),
        takeProfit: currentPrice * (1 + takeProfit / 100),
        size: Math.min(maxPositionSize, calculatePositionSize(currentPrice, riskMetrics))
      };
    } else if (priceChange < -0.01 && riskLevel !== 'Alto') {
      return { 
        action: 'SELL', 
        price: currentPrice, 
        reason: 'Previsão de queda com risco aceitável',
        stopLoss: currentPrice * (1 + stopLoss / 100),
        takeProfit: currentPrice * (1 - takeProfit / 100),
        size: Math.min(maxPositionSize, calculatePositionSize(currentPrice, riskMetrics))
      };
    }

    return { action: 'HOLD', reason: 'Condições não favoráveis para negociação' };
  };

  const getRiskLevel = (riskMetrics) => {
    if (riskMetrics.var > 0.03 || riskMetrics.volatility > 0.4) return 'Alto';
    if (riskMetrics.var > 0.02 || riskMetrics.volatility > 0.3) return 'Médio';
    return 'Baixo';
  };

  const calculatePositionSize = (currentPrice, riskMetrics) => {
    const riskPerTrade = 0.01; // 1% do capital
    const accountSize = 10000; // Exemplo de tamanho da conta
    return (accountSize * riskPerTrade) / (currentPrice * riskMetrics.volatility);
  };

  const executeTrade = (decision) => {
    console.log(`Executando ${decision.action} a ${decision.price}`);
    console.log(`Stop Loss: ${decision.stopLoss}, Take Profit: ${decision.takeProfit}`);
    console.log(`Tamanho da posição: ${decision.size}`);
    setLastTrade(decision);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Negociação Automatizada</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            checked={isAutomatedTradingEnabled}
            onCheckedChange={setIsAutomatedTradingEnabled}
          />
          <Label htmlFor="automated-trading">
            {isAutomatedTradingEnabled ? "Ativo" : "Inativo"}
          </Label>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="stop-loss">Stop Loss (%)</Label>
            <Slider
              id="stop-loss"
              min={0.5}
              max={5}
              step={0.1}
              value={[stopLoss]}
              onValueChange={(value) => setStopLoss(value[0])}
            />
            <span>{stopLoss.toFixed(1)}%</span>
          </div>
          
          <div>
            <Label htmlFor="take-profit">Take Profit (%)</Label>
            <Slider
              id="take-profit"
              min={0.5}
              max={10}
              step={0.1}
              value={[takeProfit]}
              onValueChange={(value) => setTakeProfit(value[0])}
            />
            <span>{takeProfit.toFixed(1)}%</span>
          </div>
          
          <div>
            <Label htmlFor="max-position">Tamanho Máximo da Posição</Label>
            <Slider
              id="max-position"
              min={100}
              max={10000}
              step={100}
              value={[maxPositionSize]}
              onValueChange={(value) => setMaxPositionSize(value[0])}
            />
            <span>{maxPositionSize}</span>
          </div>
        </div>

        {lastTrade && (
          <div className="mt-4">
            <p>Última Negociação:</p>
            <p>Ação: {lastTrade.action}</p>
            <p>Preço: {lastTrade.price.toFixed(2)}</p>
            <p>Motivo: {lastTrade.reason}</p>
            <p>Stop Loss: {lastTrade.stopLoss?.toFixed(2)}</p>
            <p>Take Profit: {lastTrade.takeProfit?.toFixed(2)}</p>
            <p>Tamanho da Posição: {lastTrade.size?.toFixed(2)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomatedTrading;