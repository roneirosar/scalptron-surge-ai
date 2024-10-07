import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TradingStatistics = ({ trades = [], totalProfit = 0, winRate = 0 }) => {
  const closedTrades = trades.filter(trade => trade.exitPrice !== null);
  const averageProfit = trades.length > 0 ? totalProfit / trades.length : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total de trades: {trades.length}</p>
        <p>Trades fechados: {closedTrades.length}</p>
        <p>Win rate: {winRate.toFixed(2)}%</p>
        <p>Lucro/Perda total: ${totalProfit.toFixed(2)}</p>
        <p>Média de lucro por trade: ${averageProfit.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default TradingStatistics;