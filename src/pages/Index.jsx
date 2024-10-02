import React from 'react';
import ScalpingAI from '../components/ScalpingAI';
import TradingAIRoadmap from '../components/TradingAIRoadmap';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">IA de Scalping Trading</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Mapa do Projeto</h2>
          <div className="h-[500px] w-full">
            <TradingAIRoadmap />
          </div>
        </div>
        <ScalpingAI />
      </div>
    </div>
  );
};

export default Index;