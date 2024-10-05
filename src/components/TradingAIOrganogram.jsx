import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const TradingAIOrganogram = () => {
  return (
    <div className="flex flex-col items-center">
      <Card className="w-64 mb-4">
        <CardContent className="text-center p-4">
          <h3 className="font-bold">Módulo Central</h3>
          <p>Coordenação e Controle</p>
        </CardContent>
      </Card>
      <div className="flex justify-center space-x-4 mb-4">
        <Card className="w-48">
          <CardContent className="text-center p-4">
            <h4 className="font-semibold">Coleta de Dados</h4>
            <p>APIs e Feeds</p>
          </CardContent>
        </Card>
        <Card className="w-48">
          <CardContent className="text-center p-4">
            <h4 className="font-semibold">Processamento</h4>
            <p>Limpeza e Normalização</p>
          </CardContent>
        </Card>
        <Card className="w-48">
          <CardContent className="text-center p-4">
            <h4 className="font-semibold">Análise</h4>
            <p>Indicadores e ML</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-center space-x-4">
        <Card className="w-48">
          <CardContent className="text-center p-4">
            <h4 className="font-semibold">Tomada de Decisão</h4>
            <p>Estratégias de Trading</p>
          </CardContent>
        </Card>
        <Card className="w-48">
          <CardContent className="text-center p-4">
            <h4 className="font-semibold">Execução</h4>
            <p>Ordens e Gerenciamento</p>
          </CardContent>
        </Card>
        <Card className="w-48">
          <CardContent className="text-center p-4">
            <h4 className="font-semibold">Avaliação</h4>
            <p>Performance e Ajustes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingAIOrganogram;