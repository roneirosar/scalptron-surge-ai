import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AutomatedTrading = ({ marketData, lstmPrediction, riskMetrics }) => {
  const [isAutomatedTradingEnabled, setIsAutomatedTradingEnabled] = useState(false);
  const [lastTrade, setLastTrade] = useState(null);
  const [tradeSettings, setTradeSettings] = useState({
    stopLoss: 0.01,
    takeProfit: 0.02,
    maxPositionSize: 0.1,
  });

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

    if (priceChange > tradeSettings.takeProfit && riskLevel !== 'Alto') {
      return { action: 'BUY', price: currentPrice, reason: 'Previsão de alta significativa com risco aceitável' };
    } else if (priceChange < -tradeSettings.stopLoss && riskLevel !== 'Alto') {
      return { action: 'SELL', price: currentPrice, reason: 'Previsão de queda significativa com risco aceitável' };
    }

    return { action: 'HOLD', reason: 'Condições não favoráveis para negociação' };
  };

  const getRiskLevel = (riskMetrics) => {
    if (riskMetrics.var > 0.03 || riskMetrics.volatility > 0.4) return 'Alto';
    if (riskMetrics.var > 0.02 || riskMetrics.volatility > 0.3) return 'Médio';
    return 'Baixo';
  };

  const executeTrade = (decision) => {
    // Aqui você implementaria a lógica para executar a negociação real
    // Por enquanto, vamos apenas simular a execução
    console.log(`Executando ${decision.action} a ${decision.price}`);
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
            id="automated-trading"
            checked={isAutomatedTradingEnabled}
            onCheckedChange={setIsAutomatedTradingEnabled}
          />
          <Label htmlFor="automated-trading">
            {isAutomatedTradingEnabled ? "Ativo" : "Inativo"}
          </Label>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Stop Loss:</Label>
            <input
              type="number"
              value={tradeSettings.stopLoss}
              onChange={(e) => setTradeSettings({ ...tradeSettings, stopLoss: parseFloat(e.target.value) })}
              className="w-20 px-2 py-1 border rounded"
            />
          </div>
          <div className="flex justify-between">
            <Label>Take Profit:</Label>
            <input
              type="number"
              value={tradeSettings.takeProfit}
              onChange={(e) => setTradeSettings({ ...tradeSettings, takeProfit: parseFloat(e.target.value) })}
              className="w-20 px-2 py-1 border rounded"
            />
          </div>
          <div className="flex justify-between">
            <Label>Tamanho Máximo da Posição:</Label>
            <input
              type="number"
              value={tradeSettings.maxPositionSize}
              onChange={(e) => setTradeSettings({ ...tradeSettings, maxPositionSize: parseFloat(e.target.value) })}
              className="w-20 px-2 py-1 border rounded"
            />
          </div>
        </div>
        {lastTrade && (
          <div className="mt-4">
            <p>Última Negociação:</p>
            <p>Ação: {lastTrade.action}</p>
            <p>Preço: {lastTrade.price.toFixed(2)}</p>
            <p>Motivo: {lastTrade.reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomatedTrading;