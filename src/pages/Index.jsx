import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TradingAITimeline from '../components/TradingAITimeline';
import TradingAIOrganogram from '../components/TradingAIOrganogram';
import ProjectDashboard from '../components/ProjectDashboard';
import AIConstructionFlowchart from '../components/AIConstructionFlowchart';
import AIOperationFlowchart from '../components/AIOperationFlowchart';
import AIDecisionProcess from '../components/AIDecisionProcess';
import ScalpingAI from '../components/ScalpingAI';
import LSTMModel from '../components/LSTMModel';
import RiskManagement from '../components/RiskManagement';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">ScalpTron: IA Autônoma de Scalping Trading</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard de Trading em Tempo Real</CardTitle>
          </CardHeader>
          <CardContent>
            <ScalpingAI />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Modelo LSTM e Previsões</CardTitle>
          </CardHeader>
          <CardContent>
            <LSTMModel marketData={[]} /> {/* You'll need to pass actual market data here */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskManagement marketData={[]} currentPosition={null} /> {/* Pass actual data and position */}
          </CardContent>
        </Card>
        
        <ProjectDashboard />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Fluxograma de Construção da IA</CardTitle>
          </CardHeader>
          <CardContent>
            <AIConstructionFlowchart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Fluxograma de Operação da IA</CardTitle>
          </CardHeader>
          <CardContent>
            <AIOperationFlowchart />
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Processo de Tomada de Decisão da IA</CardTitle>
        </CardHeader>
        <CardContent>
          <AIDecisionProcess />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Cronograma de Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent>
            <TradingAITimeline />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Organograma da IA</CardTitle>
          </CardHeader>
          <CardContent>
            <TradingAIOrganogram />
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Visão Geral do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            ScalpTron é uma IA totalmente autônoma projetada para ser a mais assertiva e lucrativa plataforma de Scalping Trading do mundo. Nossa IA integra análise de dados em tempo real, aprendizado de máquina avançado e estratégias de trading otimizadas para maximizar os lucros e minimizar os riscos.
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