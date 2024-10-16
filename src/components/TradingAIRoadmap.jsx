import React from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';

const initialElements = [
  {
    id: '1',
    type: 'input',
    data: { label: 'ScalpTron IA' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Coleta de Dados' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Processamento' },
    position: { x: 250, y: 100 },
  },
  {
    id: '4',
    data: { label: 'Análise' },
    position: { x: 400, y: 100 },
  },
  {
    id: '5',
    data: { label: 'Tomada de Decisão' },
    position: { x: 250, y: 200 },
  },
  {
    id: '6',
    data: { label: 'Execução de Trades' },
    position: { x: 250, y: 300 },
  },
  {
    id: '7',
    data: { label: 'Avaliação de Desempenho' },
    position: { x: 250, y: 400 },
  },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e1-4', source: '1', target: '4', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
  { id: 'e7-2', source: '7', target: '2', type: 'step', style: { stroke: '#f6ab6c' } },
];

const TradingAIRoadmap = () => {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <ReactFlow 
        elements={initialElements}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default TradingAIRoadmap;