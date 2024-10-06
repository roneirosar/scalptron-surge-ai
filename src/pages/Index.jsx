import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            <LSTMModel marketData={[]} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskManagement marketData={[]} currentPosition={null} />
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Visão Geral do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            ScalpTron é uma IA autônoma projetada para ser uma plataforma assertiva e lucrativa de Scalping Trading. Nossa IA integra análise de dados em tempo real, aprendizado de máquina avançado e estratégias de trading otimizadas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;