import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MetricsDisplay = ({ metrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Win Rate:</span>
            <span>{metrics?.winRate?.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Profit Factor:</span>
            <span>{metrics?.profitFactor?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Sharpe Ratio:</span>
            <span>{metrics?.sharpeRatio?.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsDisplay;