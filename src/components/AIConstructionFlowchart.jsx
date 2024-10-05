import React from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';

const initialElements = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Planejamento Inicial' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Coleta de Dados' },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Processamento de Dados' },
    position: { x: 250, y: 200 },
  },
  {
    id: '4',
    data: { label: 'Desenvolvimento de Algoritmos' },
    position: { x: 250, y: 300 },
  },
  {
    id: '5',
    data: { label: 'Implementação de ML' },
    position: { x: 250, y: 400 },
  },
  {
    id: '6',
    data: { label: 'Testes e Otimização' },
    position: { x: 250, y: 500 },
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'Implantação' },
    position: { x: 250, y: 600 },
  },
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
];

const AIConstructionFlowchart = () => {
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

export default AIConstructionFlowchart;