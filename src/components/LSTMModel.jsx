import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prepareData, createSequences, buildModel, trainModel, makePrediction, evaluateModel } from '../utils/lstmUtils';

const LSTMModel = ({ marketData, onPredictionUpdate }) => {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [modelStatus, setModelStatus] = useState('Inicializando');
  const [modelPerformance, setModelPerformance] = useState(null);

  useEffect(() => {
    const trainAndPredict = async () => {
      if (!marketData || marketData.length < 200) {
        setModelStatus('Dados insuficientes');
        return;
      }

      setModelStatus('Preparando dados');
      const features = ['close', 'volume', 'rsi', 'macd'];
      const { normalizedData, dataMean, dataStd } = prepareData(marketData, features);
      
      const sequenceLength = 60;
      const [xs, ys] = createSequences(normalizedData, sequenceLength);
      
      // Split data into training and testing sets
      const splitIndex = Math.floor(xs.shape[0] * 0.8);
      const trainXs = xs.slice([0, 0], [splitIndex, -1]);
      const trainYs = ys.slice([0, 0], [splitIndex, -1]);
      const testXs = xs.slice([splitIndex, 0]);
      const testYs = ys.slice([splitIndex, 0]);
      
      setModelStatus('Construindo modelo');
      const model = buildModel(sequenceLength, features.length);
      
      setModelStatus('Treinando modelo');
      const history = await trainModel(model, trainXs, trainYs, setModelStatus);
      
      setModelStatus('Avaliando modelo');
      const performance = evaluateModel(model, testXs, testYs);
      setModelPerformance(performance);
      
      setModelStatus('Fazendo previsão');
      const lastSequence = normalizedData.slice([-sequenceLength]).reshape([1, sequenceLength, features.length]);
      const predictedValue = makePrediction(model, lastSequence, dataStd, dataMean);
      
      const predictionValue = predictedValue.dataSync()[0];
      setPrediction(predictionValue);
      onPredictionUpdate(predictionValue);
      
      const mse = performance.mse;
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
        {modelPerformance && (
          <>
            <p>Performance do modelo:</p>
            <p>MSE: {modelPerformance.mse.toFixed(4)}</p>
            <p>Loss: {modelPerformance.loss.toFixed(4)}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LSTMModel;