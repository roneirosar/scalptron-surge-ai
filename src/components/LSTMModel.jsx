import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { prepareData, createSequences, buildModel, trainModel, makePrediction, evaluateModel } from '../utils/lstmUtils';

const LSTMModel = ({ marketData, onPredictionUpdate }) => {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [modelStatus, setModelStatus] = useState('Inicializando');
  const [modelPerformance, setModelPerformance] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);

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

      // Update prediction history
      setPredictionHistory(prevHistory => [
        ...prevHistory,
        { time: new Date().toLocaleTimeString(), predicted: predictionValue, actual: marketData[marketData.length - 1].close }
      ].slice(-20)); // Keep only the last 20 predictions

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
            <p>RMSE: {Math.sqrt(modelPerformance.mse).toFixed(4)}</p>
            <p>MAE: {modelPerformance.mae.toFixed(4)}</p>
            <p>R²: {modelPerformance.r2.toFixed(4)}</p>
          </>
        )}
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Histórico de Previsões</h4>
          <LineChart width={500} height={300} data={predictionHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="predicted" stroke="#8884d8" name="Previsto" />
            <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Real" />
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
};

export default LSTMModel;