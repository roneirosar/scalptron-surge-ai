import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TradingAIRoadmap from '../components/TradingAIRoadmap';
import TradingAITimeline from '../components/TradingAITimeline';
import TradingAIOrganogram from '../components/TradingAIOrganogram';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">ScalpTron: IA Autônoma de Scalping Trading</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Mapa Mental do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <TradingAIRoadmap />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cronograma de Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent>
            <TradingAITimeline />
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Organograma da IA</CardTitle>
        </CardHeader>
        <CardContent>
          <TradingAIOrganogram />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            ScalpTron é uma IA totalmente autônoma projetada para ser a mais acertiva e lucrativa plataforma de Scalping Trading do mundo. Nossa IA integra análise de dados em tempo real, aprendizado de máquina avançado e estratégias de trading otimizadas para maximizar os lucros e minimizar os riscos.
          </p>
          <ul className="list-disc list-inside mt-4">
            <li>Coleta e processamento de dados em tempo real</li>
            <li>Análise técnica e fundamental automatizada</li>
            <li>Tomada de decisão baseada em múltiplos indicadores</li>
            <li>Execução de trades com alta frequência e baixa latência</li>
            <li>Gerenciamento de risco adaptativo</li>
            <li>Aprendizado contínuo e otimização de estratégias</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;