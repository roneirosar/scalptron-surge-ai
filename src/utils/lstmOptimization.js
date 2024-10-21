import { buildModel, trainModel } from './lstmModel';
import { prepareData, createSequences } from './lstmUtils';

export const optimizeLSTM = async (xs, ys, setModelStatus) => {
  const sequenceLength = xs.shape[1];
  const featuresLength = xs.shape[2];
  
  const hyperparameters = [
    { units: 64, dropout: 0.1, learningRate: 0.001, epochs: 100, batchSize: 32 },
    { units: 128, dropout: 0.2, learningRate: 0.0005, epochs: 150, batchSize: 64 },
    { units: 256, dropout: 0.3, learningRate: 0.0001, epochs: 200, batchSize: 128 },
  ];

  let bestModel = null;
  let bestPerformance = Infinity;

  for (const params of hyperparameters) {
    setModelStatus(`Otimizando: Testando unidades=${params.units}, dropout=${params.dropout}, taxa de aprendizado=${params.learningRate}`);
    
    const model = buildModel(sequenceLength, featuresLength, params);
    const history = await trainModel(model, xs, ys, params, setModelStatus);

    const performance = history.history.val_loss[history.history.val_loss.length - 1];
    
    if (performance < bestPerformance) {
      bestModel = model;
      bestPerformance = performance;
    }
  }

  setModelStatus(`Otimização concluída. Melhor performance: ${bestPerformance.toFixed(4)}`);
  return bestModel;
};

export const continuousLearning = async (model, newData, setModelStatus) => {
  const { normalizedData, dataMean, dataStd } = prepareData(newData, ['close', 'volume', 'rsi', 'macd', 'atr', 'adx']);
  const [xs, ys] = createSequences(normalizedData, 60);
  
  setModelStatus('Iniciando aprendizado contínuo...');
  await trainModel(model, xs, ys, { epochs: 10, batchSize: 32 }, setModelStatus);
  setModelStatus('Aprendizado contínuo concluído');
  
  return model;
};