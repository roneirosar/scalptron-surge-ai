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

export { buildModel, trainModel, makePrediction, evaluateModel, optimizeLSTM, continuousLearning };