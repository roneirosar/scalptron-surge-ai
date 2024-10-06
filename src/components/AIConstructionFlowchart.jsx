import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'react-flow-renderer';

const initialElements = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Coleta de Dados' },
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
    data: { label: 'Rede Neural LSTM' },
    position: { x: 250, y: 300 },
  },
  {
    id: '6',
    data: { label: 'Tomada de Decisão' },
    position: { x: 250, y: 400 },
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'Execução de Trade' },
    position: { x: 250, y: 500 },
  },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
];

const AIConstructionFlowchart = () => {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ReactFlow 
        elements={initialElements}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default AIConstructionFlowchart;