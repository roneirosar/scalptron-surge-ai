import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { prepareData, createSequences, buildModel, trainModel, makePrediction, evaluateModel, optimizeHyperparameters } from '../utils/lstmUtils';

const LSTMModel = ({ marketData, onPredictionUpdate, onModelUpdate }) => {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [modelStatus, setModelStatus] = useState('Inicializando');
  const [modelPerformance, setModelPerformance] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState(null);

  useEffect(() => {
    const trainAndPredict = async () => {
      if (!marketData || marketData.length < 200) {
        setModelStatus('Dados insuficientes');
        return;
      }

      setModelStatus('Preparando dados');
      const features = ['close', 'volume', 'sma20', 'ema20', 'upperBB', 'lowerBB', 'rsi', 'macd', 'macdSignal', 'macdHistogram'];
      const { normalizedData, dataMean, dataStd } = prepareData(marketData, features);
      
      const sequenceLength = 60;
      const [xs, ys] = createSequences(normalizedData, sequenceLength);
      
      const splitIndex = Math.floor(xs.shape[0] * 0.8);
      const trainXs = xs.slice([0, 0], [splitIndex, -1]);
      const trainYs = ys.slice([0, 0], [splitIndex, -1]);
      const testXs = xs.slice([splitIndex, 0]);
      const testYs = ys.slice([splitIndex, 0]);
      
      setModelStatus('Otimizando hiperparâmetros');
      const optimizedModel = await optimizeHyperparameters(trainXs, trainYs, setModelStatus);
      
      setModelStatus('Treinando modelo otimizado');
      await trainModel(optimizedModel, trainXs, trainYs, (epoch, logs) => {
        setTrainingProgress({ epoch, loss: logs.loss, valLoss: logs.val_loss });
      });
      
      setModelStatus('Avaliando modelo');
      const performance = evaluateModel(optimizedModel, testXs, testYs);
      setModelPerformance(performance);
      
      setModelStatus('Fazendo previsão');
      const lastSequence = normalizedData.slice([-sequenceLength]).reshape([1, sequenceLength, features.length]);
      const predictedValue = makePrediction(optimizedModel, lastSequence, dataStd, dataMean);
      
      const predictionValue = predictedValue.dataSync()[0];
      setPrediction(predictionValue);
      onPredictionUpdate(predictionValue);
      onModelUpdate(optimizedModel);
      
      const mse = performance.mse;
      const confidenceInterval = 1.96 * Math.sqrt(mse);
      setConfidence(confidenceInterval);

      setPredictionHistory(prevHistory => [
        ...prevHistory,
        { time: new Date().toLocaleTimeString(), predicted: predictionValue, actual: marketData[marketData.length - 1].close }
      ].slice(-20));

      setModelStatus('Previsão concluída');
    };
    
    trainAndPredict();
  }, [marketData, onPredictionUpdate, onModelUpdate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modelo LSTM Otimizado</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {modelStatus}</p>
        {trainingProgress && (
          <div>
            <p>Progresso do Treinamento:</p>
            <p>Época: {trainingProgress.epoch + 1}/150</p>
            <p>Loss: {trainingProgress.loss.toFixed(4)}</p>
            <p>Validation Loss: {trainingProgress.valLoss.toFixed(4)}</p>
          </div>
        )}
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
            <p>RMSE: {modelPerformance.rmse.toFixed(4)}</p>
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