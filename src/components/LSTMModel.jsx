import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LSTMModel = ({ marketData }) => {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    const trainAndPredict = async () => {
      // Preparar os dados
      const data = marketData.map(d => d.close);
      const tensorData = tf.tensor2d(data, [data.length, 1]);
      
      // Normalizar os dados
      const dataMean = tensorData.mean();
      const dataStd = tensorData.std();
      const normalizedData = tensorData.sub(dataMean).div(dataStd);
      
      // Criar sequências para treinamento
      const sequenceLength = 20;
      const [xs, ys] = tf.tidy(() => {
        const sequences = [];
        const targets = [];
        for (let i = sequenceLength; i < normalizedData.shape[0]; i++) {
          sequences.push(normalizedData.slice([i - sequenceLength], [sequenceLength]));
          targets.push(normalizedData.slice([i], [1]));
        }
        return [tf.concat(sequences), tf.concat(targets)];
      });
      
      // Criar e treinar o modelo
      const model = tf.sequential();
      model.add(tf.layers.lstm({ units: 100, returnSequences: true, inputShape: [sequenceLength, 1] }));
      model.add(tf.layers.dropout(0.2));
      model.add(tf.layers.lstm({ units: 50, returnSequences: false }));
      model.add(tf.layers.dropout(0.2));
      model.add(tf.layers.dense({ units: 1 }));
      
      model.compile({ 
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['mse']
      });
      
      await model.fit(xs, ys, { 
        epochs: 100, 
        batchSize: 32,
        validationSplit: 0.1,
        callbacks: tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 10 })
      });
      
      // Fazer uma previsão
      const lastSequence = normalizedData.slice([-sequenceLength]).reshape([1, sequenceLength, 1]);
      const predictedNormalized = model.predict(lastSequence);
      const predictedValue = predictedNormalized.mul(dataStd).add(dataMean);
      
      setPrediction(predictedValue.dataSync()[0]);
      
      // Calcular intervalo de confiança
      const mse = model.evaluate(xs, ys)[0].dataSync()[0];
      const confidenceInterval = 1.96 * Math.sqrt(mse);
      setConfidence(confidenceInterval);
    };
    
    if (marketData && marketData.length > 0) {
      trainAndPredict();
    }
  }, [marketData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão LSTM Avançada</CardTitle>
      </CardHeader>
      <CardContent>
        {prediction ? (
          <>
            <p>Próximo preço previsto: {prediction.toFixed(2)}</p>
            <p>Intervalo de confiança: ±{confidence.toFixed(2)}</p>
          </>
        ) : (
          <p>Treinando modelo...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LSTMModel;