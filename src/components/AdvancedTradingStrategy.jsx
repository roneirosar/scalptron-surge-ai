import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AdvancedTradingStrategy = ({ marketData, lstmPrediction, riskMetrics }) => {
  const [isStrategyEnabled, setIsStrategyEnabled] = useState(false);
  const [lastTrade, setLastTrade] = useState(null);
  const [stopLoss, setStopLoss] = useState(2);
  const [takeProfit, setTakeProfit] = useState(3);
  const [positionSize, setPositionSize] = useState(1000);

  useEffect(() => {
    if (isStrategyEnabled && marketData && lstmPrediction && riskMetrics) {
      const decision = makeTradeDecision(marketData, lstmPrediction, riskMetrics);
      if (decision.action !== 'HOLD') {
        executeTrade(decision);
      }
    }
  }, [isStrategyEnabled, marketData, lstmPrediction, riskMetrics]);

  const makeTradeDecision = (marketData, prediction, riskMetrics) => {
    const currentPrice = marketData[marketData.length - 1].close;
    const priceChange = (prediction - currentPrice) / currentPrice;
    const riskLevel = getRiskLevel(riskMetrics);

    if (priceChange > 0.01 && riskLevel !== 'High') {
      return { 
        action: 'BUY', 
        price: currentPrice, 
        reason: 'Previsão de alta com risco aceitável',
        stopLoss: currentPrice * (1 - stopLoss / 100),
        takeProfit: currentPrice * (1 + takeProfit / 100)
      };
    } else if (priceChange < -0.01 && riskLevel !== 'High') {
      return { 
        action: 'SELL', 
        price: currentPrice, 
        reason: 'Previsão de queda com risco aceitável',
        stopLoss: currentPrice * (1 + stopLoss / 100),
        takeProfit: currentPrice * (1 - takeProfit / 100)
      };
    }

    return { action: 'HOLD', reason: 'Condições não favoráveis para negociação' };
  };

  const getRiskLevel = (riskMetrics) => {
    if (riskMetrics.volatility > 0.03 || riskMetrics.var > 0.02) return 'High';
    if (riskMetrics.volatility > 0.02 || riskMetrics.var > 0.01) return 'Medium';
    return 'Low';
  };

  const executeTrade = (decision) => {
    console.log(`Executando ${decision.action} a ${decision.price}`);
    console.log(`Stop Loss: ${decision.stopLoss}, Take Profit: ${decision.takeProfit}`);
    setLastTrade(decision);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estratégia de Trading Avançada</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            checked={isStrategyEnabled}
            onCheckedChange={setIsStrategyEnabled}
          />
          <Label htmlFor="strategy-enabled">
            {isStrategyEnabled ? "Ativo" : "Inativo"}
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
            <Label htmlFor="position-size">Tamanho da Posição ($)</Label>
            <Slider
              id="position-size"
              min={100}
              max={10000}
              step={100}
              value={[positionSize]}
              onValueChange={(value) => setPositionSize(value[0])}
            />
            <span>${positionSize}</span>
          </div>
        </div>

        {lastTrade && (
          <div className="mt-4">
            <p>Última Negociação:</p>
            <p>Ação: {lastTrade.action}</p>
            <p>Preço: {lastTrade.price.toFixed(2)}</p>
            <p>Motivo: {lastTrade.reason}</p>
            <p>Stop Loss: {lastTrade.stopLoss.toFixed(2)}</p>
            <p>Take Profit: {lastTrade.takeProfit.toFixed(2)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedTradingStrategy;