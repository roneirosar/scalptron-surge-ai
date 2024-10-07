import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PerformanceMetrics = ({ metrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Desempenho</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Sharpe Ratio:</p>
            <p>{metrics.sharpeRatio.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Sortino Ratio:</p>
            <p>{metrics.sortinoRatio.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Max Drawdown:</p>
            <p>{(metrics.maxDrawdown * 100).toFixed(2)}%</p>
          </div>
          <div>
            <p className="font-semibold">Profit Factor:</p>
            <p>{metrics.profitFactor.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Expectancy:</p>
            <p>${metrics.expectancy.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Avg. Trade Duration:</p>
            <p>{metrics.avgTradeDuration} min</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;