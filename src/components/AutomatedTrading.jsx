import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { assessRisk, calculatePositionSize, adjustStopLoss, shouldClosePosition, dynamicRiskAdjustment, calculateOptimalLeverage } from '../utils/riskManagement';
import { toast } from 'sonner';

const AutomatedTrading = ({ marketData, lstmPrediction, riskMetrics }) => {
  const [isAutomatedTradingEnabled, setIsAutomatedTradingEnabled] = useState(false);
  const [trades, setTrades] = useState([]);
  const [stopLoss, setStopLoss] = useState(2);
  const [takeProfit, setTakeProfit] = useState(3);
  const [maxPositionSize, setMaxPositionSize] = useState(1000);
  const [tradingStrategy, setTradingStrategy] = useState('conservative');
  const [trailingStop, setTrailingStop] = useState(1);
  const [currentPosition, setCurrentPosition] = useState(null);

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
    const riskAssessment = assessRisk(marketData, currentPosition, { volatilityIndex: riskMetrics.volatility * 100, trendStrength: 50 });
    const dynamicRisk = dynamicRiskAdjustment(maxPositionSize, riskMetrics.volatility);
    const optimalLeverage = calculateOptimalLeverage(riskMetrics.sharpeRatio, riskMetrics.volatility);

    if (priceChange > 0.01 && riskAssessment.riskLevel !== 'Alto' && riskAssessment.riskLevel !== 'Muito Alto') {
      const positionSize = calculatePositionSize(maxPositionSize, dynamicRisk, stopLoss / 100) * optimalLeverage;
      return { 
        action: 'BUY', 
        price: currentPrice, 
        reason: 'Previsão de alta com risco aceitável',
        stopLoss: currentPrice * (1 - stopLoss / 100),
        takeProfit: currentPrice * (1 + takeProfit / 100),
        size: positionSize
      };
    } else if (priceChange < -0.01 && riskAssessment.riskLevel !== 'Alto' && riskAssessment.riskLevel !== 'Muito Alto') {
      const positionSize = calculatePositionSize(maxPositionSize, dynamicRisk, stopLoss / 100) * optimalLeverage;
      return { 
        action: 'SELL', 
        price: currentPrice, 
        reason: 'Previsão de queda com risco aceitável',
        stopLoss: currentPrice * (1 + stopLoss / 100),
        takeProfit: currentPrice * (1 - takeProfit / 100),
        size: positionSize
      };
    }

    return { action: 'HOLD', reason: 'Condições não favoráveis para negociação' };
  };

  const executeTrade = (decision) => {
    console.log(`Executando ${decision.action} a ${decision.price}`);
    setTrades(prevTrades => [...prevTrades, {
      time: new Date().toLocaleTimeString(),
      action: decision.action,
      price: decision.price,
      reason: decision.reason,
      size: decision.size,
      stopLoss: decision.stopLoss,
      takeProfit: decision.takeProfit
    }]);
    toast.success(`Trade executado: ${decision.action} a ${decision.price}`);
  };

  const equityCurve = trades.map((trade, index) => ({
    tradeNumber: index + 1,
    equity: trades.slice(0, index + 1).reduce((sum, t) => sum + (t.profit || 0), 0)
  }));

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
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="trading-strategy">Estratégia de Trading</Label>
            <select
              id="trading-strategy"
              value={tradingStrategy}
              onChange={(e) => setTradingStrategy(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="conservative">Conservadora</option>
              <option value="moderate">Moderada</option>
              <option value="aggressive">Agressiva</option>
            </select>
          </div>
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
            <Label htmlFor="trailing-stop">Trailing Stop (%)</Label>
            <Slider
              id="trailing-stop"
              min={0.1}
              max={3}
              step={0.1}
              value={[trailingStop]}
              onValueChange={(value) => setTrailingStop(value[0])}
            />
            <span>{trailingStop.toFixed(1)}%</span>
          </div>
          <div>
            <Label htmlFor="max-position">Tamanho Máximo da Posição</Label>
            <Input
              id="max-position"
              type="number"
              value={maxPositionSize}
              onChange={(e) => setMaxPositionSize(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Histórico de Trades</h3>
          <div className="max-h-60 overflow-y-auto">
            {trades.map((trade, index) => (
              <div key={index} className="mb-2">
                <p>{trade.time} - {trade.action} @ {trade.price.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{trade.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Curva de Equity</h3>
          <LineChart width={500} height={300} data={equityCurve}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tradeNumber" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="equity" stroke="#8884d8" name="Equity" />
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomatedTrading;
