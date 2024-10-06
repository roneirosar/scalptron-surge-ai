import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScalpingAI from '../components/ScalpingAI';
import LSTMModel from '../components/LSTMModel';
import RiskManagement from '../components/RiskManagement';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const ProjectStatus = ({ title, status }) => {
  const icon = status === 'Completo' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
               status === 'Em Progresso' ? <AlertCircle className="h-4 w-4 text-yellow-500" /> :
               <XCircle className="h-4 w-4 text-red-500" />;
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span>{title}: <strong>{status}</strong></span>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">ScalpTron: IA Autônoma de Scalping Trading</h1>
      
      <Alert className="mb-8">
        <AlertTitle>Status do Projeto</AlertTitle>
        <AlertDescription>
          <ProjectStatus title="Coleta de Dados em Tempo Real" status="Completo" />
          <ProjectStatus title="Processamento de Dados" status="Completo" />
          <ProjectStatus title="Modelo LSTM" status="Em Progresso" />
          <ProjectStatus title="Gerenciamento de Risco" status="Em Progresso" />
          <ProjectStatus title="Execução Autônoma de Trades" status="Pendente" />
          <ProjectStatus title="Backtesting e Otimização" status="Pendente" />
        </AlertDescription>
      </Alert>
      
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
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Finalizar e otimizar o modelo LSTM para previsões mais precisas</li>
            <li>Implementar estratégias de gerenciamento de risco mais avançadas</li>
            <li>Desenvolver o módulo de execução autônoma de trades</li>
            <li>Realizar backtesting extensivo e otimização de parâmetros</li>
            <li>Implementar mecanismos de auto-ajuste e aprendizado contínuo</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;