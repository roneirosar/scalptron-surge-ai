import * as tf from '@tensorflow/tfjs';

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

export const buildModel = (sequenceLength, featuresLength) => {
  const model = tf.sequential();
  model.add(tf.layers.lstm({
    units: 128,
    returnSequences: true,
    inputShape: [sequenceLength, featuresLength]
  }));
  model.add(tf.layers.dropout(0.2));
  model.add(tf.layers.lstm({ units: 64, returnSequences: false }));
  model.add(tf.layers.dropout(0.2));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  
  const optimizer = tf.train.adam(0.001);
  model.compile({
    optimizer: optimizer,
    loss: 'meanSquaredError',
    metrics: ['mse']
  });
  
  return model;
};

export const trainModel = async (model, xs, ys, setModelStatus) => {
  const history = await model.fit(xs, ys, {
    epochs: 150,
    batchSize: 32,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        setModelStatus(`Treinando: Época ${epoch + 1}/150 - Loss: ${logs.loss.toFixed(4)} - Val Loss: ${logs.val_loss.toFixed(4)}`);
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

export const optimizeHyperparameters = async (xs, ys, setModelStatus) => {
  const sequenceLength = xs.shape[1];
  const featuresLength = xs.shape[2];
  
  const hyperparameters = [
    { units: 64, dropout: 0.1 },
    { units: 128, dropout: 0.2 },
    { units: 256, dropout: 0.3 },
  ];

  let bestModel = null;
  let bestPerformance = Infinity;

  for (const params of hyperparameters) {
    setModelStatus(`Otimizando: Testando unidades=${params.units}, dropout=${params.dropout}`);
    
    const model = tf.sequential();
    model.add(tf.layers.lstm({
      units: params.units,
      returnSequences: true,
      inputShape: [sequenceLength, featuresLength]
    }));
    model.add(tf.layers.dropout(params.dropout));
    model.add(tf.layers.lstm({ units: params.units / 2, returnSequences: false }));
    model.add(tf.layers.dropout(params.dropout));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mse']
    });

    const history = await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });

    const performance = history.history.val_loss[history.history.val_loss.length - 1];
    
    if (performance < bestPerformance) {
      bestModel = model;
      bestPerformance = performance;
    }
  }

  setModelStatus(`Otimização concluída. Melhor performance: ${bestPerformance.toFixed(4)}`);
  return bestModel;
};