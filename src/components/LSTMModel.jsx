import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prepareData, createSequences, buildModel, trainModel, makePrediction } from '../utils/lstmUtils';

const LSTMModel = ({ marketData, onPredictionUpdate }) => {
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
      const { normalizedData, dataMean, dataStd } = prepareData(marketData, features);
      
      const sequenceLength = 50;
      const [xs, ys] = createSequences(normalizedData, sequenceLength);
      
      setModelStatus('Construindo modelo');
      const model = buildModel(sequenceLength, features.length);
      
      setModelStatus('Treinando modelo');
      const history = await trainModel(model, xs, ys, setModelStatus);
      
      setModelStatus('Fazendo previsão');
      const lastSequence = normalizedData.slice([-sequenceLength]).reshape([1, sequenceLength, features.length]);
      const predictedValue = makePrediction(model, lastSequence, dataStd, dataMean);
      
      const predictionValue = predictedValue.dataSync()[0];
      setPrediction(predictionValue);
      onPredictionUpdate(predictionValue);
      
      const mse = history.history.mse[history.history.mse.length - 1];
      const confidenceInterval = 1.96 * Math.sqrt(mse);
      setConfidence(confidenceInterval);

      setModelStatus('Previsão concluída');
    };
    
    trainAndPredict();
  }, [marketData, onPredictionUpdate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão LSTM Otimizada</CardTitle>
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