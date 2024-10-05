import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TradesList = ({ trades }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Trades Executados</CardTitle>
    </CardHeader>
    <CardContent>
      <ul>
        {trades.map((trade, index) => (
          <li key={index} className="mb-2">
            <span className={`font-bold ${trade.action === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
              {trade.action}
            </span>
            {' '}at {trade.entryPrice.toFixed(5)} - Target: {trade.targetPrice.toFixed(5)}
            {trade.exitPrice && (
              <span>
                {' '}- Exit: {trade.exitPrice.toFixed(5)}
                {' '}- Profit: <span className={trade.profit > 0 ? 'text-green-500' : 'text-red-500'}>
                  ${trade.profit.toFixed(2)}
                </span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default TradesList;