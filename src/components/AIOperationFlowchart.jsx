import React from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';

const initialElements = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Coleta de Dados em Tempo Real' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Pré-processamento' },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Análise Técnica' },
    position: { x: 100, y: 200 },
  },
  {
    id: '4',
    data: { label: 'Análise Fundamental' },
    position: { x: 400, y: 200 },
  },
  {
    id: '5',
    data: { label: 'Modelo de ML' },
    position: { x: 250, y: 300 },
  },
  {
    id: '6',
    data: { label: 'Tomada de Decisão' },
    position: { x: 250, y: 400 },
  },
  {
    id: '7',
    data: { label: 'Execução de Trade' },
    position: { x: 250, y: 500 },
  },
  {
    id: '8',
    type: 'output',
    data: { label: 'Avaliação de Desempenho' },
    position: { x: 250, y: 600 },
  },
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e8-1', source: '8', target: '1', type: 'step', animated: true },
];

const AIOperationFlowchart = () => {
  return (
    <div style={{ height: '600px', width: '100%' }}>
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

export default AIOperationFlowchart;