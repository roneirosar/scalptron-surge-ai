import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MarketSentiment = ({ sentiment }) => {
  let icon;
  let color;

  switch (sentiment) {
    case 'Positive':
      icon = <TrendingUp className="h-6 w-6" />;
      color = 'text-green-500';
      break;
    case 'Negative':
      icon = <TrendingDown className="h-6 w-6" />;
      color = 'text-red-500';
      break;
    default:
      icon = <Minus className="h-6 w-6" />;
      color = 'text-yellow-500';
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Sentimento do Mercado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`flex items-center ${color}`}>
          {icon}
          <span className="ml-2 text-lg font-semibold">{sentiment}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSentiment;