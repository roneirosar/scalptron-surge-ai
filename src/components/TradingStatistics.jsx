import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TradingStatistics = ({ trades, totalProfit, winRate }) => (
  <Card>
    <CardHeader>
      <CardTitle>Estatísticas</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Total de trades: {trades.length}</p>
      <p>Trades fechados: {trades.filter(trade => trade.exitPrice !== null).length}</p>
      <p>Win rate: {winRate.toFixed(2)}%</p>
      <p>Lucro/Perda total: ${totalProfit.toFixed(2)}</p>
      <p>Média de lucro por trade: ${(totalProfit / trades.length || 0).toFixed(2)}</p>
    </CardContent>
  </Card>
);

export default TradingStatistics;