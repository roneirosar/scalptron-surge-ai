import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const AIDecisionProcess = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">1. Coleta de Dados</h3>
          <p>Preços, volumes, indicadores técnicos, notícias, sentimento do mercado</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">2. Análise Técnica</h3>
          <p>Padrões de candlestick, suporte/resistência, tendências, momentum</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">3. Análise Fundamental</h3>
          <p>Dados econômicos, relatórios financeiros, eventos geopolíticos</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">4. Previsão de ML</h3>
          <p>Modelos de aprendizado de máquina preveem movimentos de preço</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">5. Avaliação de Risco</h3>
          <p>Volatilidade do mercado, exposição da carteira, correlações de ativos</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">6. Decisão Final</h3>
          <p>Comprar, vender ou manter com base na análise integrada</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">7. Execução e Monitoramento</h3>
          <p>Execução de ordens, monitoramento de posições, ajustes em tempo real</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIDecisionProcess;