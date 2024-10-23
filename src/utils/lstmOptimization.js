import * as tf from '@tensorflow/tfjs';
import { buildModel, trainModel } from './lstmModel';
import { prepareData, createSequences } from './lstmUtils';

export const optimizeLSTM = async (marketData, setModelStatus) => {
  const features = ['close', 'volume', 'rsi', 'macd', 'atr', 'adx'];
  const { normalizedData, dataMean, dataStd } = prepareData(marketData, features);
  const sequenceLength = 60;
  const [xs, ys] = createSequences(normalizedData, sequenceLength);
  
  const hyperparameters = [
    { units: 128, dropout: 0.2, learningRate: 0.001, epochs: 150, batchSize: 32 },
    { units: 256, dropout: 0.3, learningRate: 0.0005, epochs: 200, batchSize: 64 },
    { units: 512, dropout: 0.4, learningRate: 0.0001, epochs: 250, batchSize: 128 }
  ];

  let bestModel = null;
  let bestPerformance = Infinity;

  for (const params of hyperparameters) {
    setModelStatus(`Otimizando: Testando configuração ${params.units} unidades`);
    const model = buildModel(sequenceLength, features.length, params);
    const history = await trainModel(model, xs, ys, params, setModelStatus);
    const performance = history.history.val_loss[history.history.val_loss.length - 1];
    
    if (performance < bestPerformance) {
      bestModel = model;
      bestPerformance = performance;
    }
  }

  return { model: bestModel, performance: bestPerformance };
};

export const continuousLearning = async (model, newData, setModelStatus) => {
  const features = ['close', 'volume', 'rsi', 'macd', 'atr', 'adx'];
  const { normalizedData } = prepareData(newData, features);
  const [xs, ys] = createSequences(normalizedData, 60);
  
  setModelStatus('Iniciando aprendizado contínuo...');
  await trainModel(model, xs, ys, { 
    epochs: 10, 
    batchSize: 32,
    learningRate: 0.0001
  }, setModelStatus);
  
  return model;
};