import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const BacktestingResults = ({ results }) => {
  if (!results) return null;

  return (
    <div className="mt-4">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Resultados do Backtesting</h3>
          <div className="grid grid-cols-2 gap-4">
            <p>Capital Final: ${results.finalCapital.toFixed(2)}</p>
            <p>Retorno Total: {results.totalReturn.toFixed(2)}%</p>
            <p>Total de Trades: {results.totalTrades}</p>
            <p>Trades Vencedores: {results.winningTrades}</p>
            <p>Trades Perdedores: {results.losingTrades}</p>
            <p>Win Rate: {results.winRate.toFixed(2)}%</p>
            <p>Profit Factor: {results.profitFactor.toFixed(2)}</p>
            <p>Índice de Sharpe: {results.sharpeRatio.toFixed(2)}</p>
            <p>Índice de Sortino: {results.sortinoRatio.toFixed(2)}</p>
            <p>Máximo Drawdown: {(results.maxDrawdown * 100).toFixed(2)}%</p>
            <p>Média de Ganho: ${results.averageWin.toFixed(2)}</p>
            <p>Média de Perda: ${results.averageLoss.toFixed(2)}</p>
            <p>Razão Ganho/Perda: {results.winLossRatio.toFixed(2)}</p>
            <p>Expectativa Matemática: ${results.expectancy.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BacktestingResults;