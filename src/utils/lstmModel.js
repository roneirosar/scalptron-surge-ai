import * as tf from '@tensorflow/tfjs';

export const buildModel = (sequenceLength, featuresLength, hyperparams) => {
  const model = tf.sequential();
  model.add(tf.layers.lstm({
    units: hyperparams.units,
    returnSequences: true,
    inputShape: [sequenceLength, featuresLength]
  }));
  model.add(tf.layers.dropout(hyperparams.dropout));
  model.add(tf.layers.lstm({ units: hyperparams.units / 2, returnSequences: false }));
  model.add(tf.layers.dropout(hyperparams.dropout));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  
  const optimizer = tf.train.adam(hyperparams.learningRate);
  model.compile({
    optimizer: optimizer,
    loss: 'meanSquaredError',
    metrics: ['mse']
  });
  
  return model;
};

export const trainModel = async (model, xs, ys, hyperparams, setModelStatus) => {
  const history = await model.fit(xs, ys, {
    epochs: hyperparams.epochs,
    batchSize: hyperparams.batchSize,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        setModelStatus(`Treinando: Época ${epoch + 1}/${hyperparams.epochs} - Loss: ${logs.loss.toFixed(4)} - Val Loss: ${logs.val_loss.toFixed(4)}`);
      }
    }
  });
  return history;
};

export const makePrediction = (model, lastSequence, dataStd, dataMean) => {
  const predictedNormalized = model.predict(lastSequence);
  return predictedNormalized.mul(dataStd.slice([0, 1])).add(dataMean.slice([0, 1]));
};

export const evaluateModel = (model, testXs, testYs) => {
  const predictions = model.predict(testXs);
  const mse = tf.losses.meanSquaredError(testYs, predictions).dataSync()[0];
  const mae = tf.losses.absoluteDifference(testYs, predictions).mean().dataSync()[0];
  
  const yMean = testYs.mean();
  const ssTot = testYs.sub(yMean).square().sum().dataSync()[0];
  const ssRes = testYs.sub(predictions).square().sum().dataSync()[0];
  const r2 = 1 - (ssRes / ssTot);

  return {
    mse: mse,
    rmse: Math.sqrt(mse),
    mae: mae,
    r2: r2
  };
};