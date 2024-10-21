import * as tf from '@tensorflow/tfjs';
import { buildModel, trainModel, makePrediction, evaluateModel } from './lstmModel';
import { optimizeLSTM, continuousLearning } from './lstmOptimization';

export const prepareData = (marketData, features) => {
  const data = marketData.map(d => features.map(f => d[f]));
  const tensorData = tf.tensor2d(data);
  const dataMean = tensorData.mean(0);
  const dataStd = tensorData.std(0);
  return {
    normalizedData: tensorData.sub(dataMean).div(dataStd),
    dataMean,
    dataStd
  };
};

export const createSequences = (normalizedData, sequenceLength) => {
  return tf.tidy(() => {
    const sequences = [];
    const targets = [];
    for (let i = sequenceLength; i < normalizedData.shape[0]; i++) {
      sequences.push(normalizedData.slice([i - sequenceLength, 0], [sequenceLength, -1]));
      targets.push(normalizedData.slice([i, 0], [1, 1]));
    }
    return [tf.concat(sequences), tf.concat(targets)];
  });
};

export const optimizeHyperparameters = async (xs, ys, setModelStatus) => {
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

export { buildModel, trainModel, makePrediction, evaluateModel, optimizeLSTM, continuousLearning };