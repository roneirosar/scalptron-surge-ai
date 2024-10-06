import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LSTMModel = ({ marketData }) => {
  const [prediction, setPrediction] = useState(null);

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
      const sequenceLength = 10;
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
      model.add(tf.layers.lstm({ units: 50, inputShape: [sequenceLength, 1] }));
      model.add(tf.layers.dense({ units: 1 }));
      model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
      
      await model.fit(xs, ys, { epochs: 50, batchSize: 32 });
      
      // Fazer uma previsão
      const lastSequence = normalizedData.slice([-sequenceLength]).reshape([1, sequenceLength, 1]);
      const predictedNormalized = model.predict(lastSequence);
      const predictedValue = predictedNormalized.mul(dataStd).add(dataMean);
      
      setPrediction(predictedValue.dataSync()[0]);
    };
    
    if (marketData && marketData.length > 0) {
      trainAndPredict();
    }
  }, [marketData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão LSTM</CardTitle>
      </CardHeader>
      <CardContent>
        {prediction ? (
          <p>Próximo preço previsto: {prediction.toFixed(2)}</p>
        ) : (
          <p>Treinando modelo...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LSTMModel;