import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LSTMModel = ({ marketData }) => {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [modelStatus, setModelStatus] = useState('Inicializando');

  useEffect(() => {
    const trainAndPredict = async () => {
      if (!marketData || marketData.length < 100) {
        setModelStatus('Dados insuficientes');
        return;
      }

      setModelStatus('Preparando dados');
      const features = ['close', 'volume', 'rsi', 'macd'];
      const data = marketData.map(d => features.map(f => d[f]));
      const tensorData = tf.tensor2d(data);
      
      const dataMean = tensorData.mean(0);
      const dataStd = tensorData.std(0);
      const normalizedData = tensorData.sub(dataMean).div(dataStd);
      
      const sequenceLength = 50;
      const [xs, ys] = tf.tidy(() => {
        const sequences = [];
        const targets = [];
        for (let i = sequenceLength; i < normalizedData.shape[0]; i++) {
          sequences.push(normalizedData.slice([i - sequenceLength, 0], [sequenceLength, -1]));
          targets.push(normalizedData.slice([i, 0], [1, 1]));
        }
        return [tf.concat(sequences), tf.concat(targets)];
      });
      
      setModelStatus('Construindo modelo');
      const model = tf.sequential();
      model.add(tf.layers.lstm({
        units: 100,
        returnSequences: true,
        inputShape: [sequenceLength, features.length]
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
      
      setModelStatus('Treinando modelo');
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
      
      setModelStatus('Fazendo previsão');
      const lastSequence = normalizedData.slice([-sequenceLength]).reshape([1, sequenceLength, features.length]);
      const predictedNormalized = model.predict(lastSequence);
      const predictedValue = predictedNormalized.mul(dataStd.slice([0, 1])).add(dataMean.slice([0, 1]));
      
      setPrediction(predictedValue.dataSync()[0]);
      
      const mse = model.evaluate(xs, ys)[0].dataSync()[0];
      const confidenceInterval = 1.96 * Math.sqrt(mse);
      setConfidence(confidenceInterval);

      setModelStatus('Previsão concluída');
    };
    
    trainAndPredict();
  }, [marketData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão LSTM Avançada</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {modelStatus}</p>
        {prediction !== null && (
          <>
            <p>Próximo preço previsto: {prediction.toFixed(2)}</p>
            <p>Intervalo de confiança: ±{confidence.toFixed(2)}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LSTMModel;