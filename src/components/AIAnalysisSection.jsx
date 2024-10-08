import React from 'react';
import AIDecisionExplanation from './AIDecisionExplanation';
import MarketSentiment from './MarketSentiment';
import LSTMModel from './LSTMModel';

const AIAnalysisSection = ({ prediction, riskAssessment, sentiment, marketData, onPredictionUpdate, onModelUpdate }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Análise da IA</h2>
    <AIDecisionExplanation prediction={prediction} riskAssessment={riskAssessment} />
    <MarketSentiment sentiment={sentiment} />
    <LSTMModel 
      marketData={marketData}
      onPredictionUpdate={onPredictionUpdate}
      onModelUpdate={onModelUpdate}
    />
  </div>
);

export default AIAnalysisSection;