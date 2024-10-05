import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const timelineItems = [
  { phase: 'Fase 1', title: 'Desenvolvimento da Infraestrutura', date: 'Mês 1-2' },
  { phase: 'Fase 2', title: 'Implementação de Algoritmos Básicos', date: 'Mês 3-4' },
  { phase: 'Fase 3', title: 'Integração de Aprendizado de Máquina', date: 'Mês 5-6' },
  { phase: 'Fase 4', title: 'Testes e Otimização', date: 'Mês 7-8' },
  { phase: 'Fase 5', title: 'Lançamento e Monitoramento', date: 'Mês 9-10' },
];

const TradingAITimeline = () => {
  return (
    <div className="space-y-4">
      {timelineItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="font-bold">{item.phase}</p>
              <p>{item.title}</p>
            </div>
            <p className="text-sm text-gray-500">{item.date}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TradingAITimeline;