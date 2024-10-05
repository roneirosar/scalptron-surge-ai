import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AIDecisionExplanation = ({ decision }) => {
  if (!decision) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decisão da IA</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-bold">Ação: <span className={decision.action === 'BUY' ? 'text-green-500' : decision.action === 'SELL' ? 'text-red-500' : 'text-yellow-500'}>{decision.action}</span></p>
        <p className="mt-2"><strong>Razão:</strong> {decision.reason}</p>
        {decision.indicators && (
          <div className="mt-4">
            <p className="font-bold">Indicadores considerados:</p>
            <ul className="list-disc list-inside">
              {Object.entries(decision.indicators).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIDecisionExplanation;