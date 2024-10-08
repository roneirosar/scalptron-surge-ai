import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AutomatedTrading = ({ marketData, lstmPrediction, riskMetrics }) => {
  const [isAutomatedTradingEnabled, setIsAutomatedTradingEnabled] = useState(false);
  const [lastTrade, setLastTrade] = useState(null);

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
      return { action: 'BUY', price: currentPrice, reason: 'Previsão de alta com risco aceitável' };
    } else if (priceChange < -0.01 && riskLevel !== 'Alto') {
      return { action: 'SELL', price: currentPrice, reason: 'Previsão de queda com risco aceitável' };
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
        <Button
          onClick={() => setIsAutomatedTradingEnabled(!isAutomatedTradingEnabled)}
          variant={isAutomatedTradingEnabled ? "destructive" : "default"}
        >
          {isAutomatedTradingEnabled ? "Desativar" : "Ativar"} Negociação Automatizada
        </Button>
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