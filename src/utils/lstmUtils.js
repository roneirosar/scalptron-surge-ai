import * as tf from '@tensorflow/tfjs';

export const prepareData = (marketData, features) => {
  const data = marketData.map(d => features.map(f => d[f]));
  const tensorData = tf.tensor2d(data);
  const dataMean = tensorData.mean(0);
  const dataStd = tensorData.std(0);
  return tensorData.sub(dataMean).div(dataStd);
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

export const buildModel = (sequenceLength, featuresLength) => {
  const model = tf.sequential();
  model.add(tf.layers.lstm({
    units: 100,
    returnSequences: true,
    inputShape: [sequenceLength, featuresLength]
  }));
  model.add(tf.layers.dropout(0.2));
  model.add(tf.layers.lstm({ units: 50, returnSequences: false }));
  model.add(tf.layers.dropout(0.2));
  model.add(tf.layers.dense({ units: 1 }));
  
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['mse']
  });
  
  return model;
};

export const trainModel = async (model, xs, ys, setModelStatus) => {
  await model.fit(xs, ys, {
    epochs: 100,
    batchSize: 32,
    validationSplit: 0.1,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        setModelStatus(`Treinando: Época ${epoch + 1}/100`);
      }
    }
  });
};

export const makePrediction = (model, lastSequence, dataStd, dataMean) => {
  const predictedNormalized = model.predict(lastSequence);
  return predictedNormalized.mul(dataStd.slice([0, 1])).add(dataMean.slice([0, 1]));
};