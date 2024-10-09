import React from 'react';
import RiskManagement from './RiskManagement';
import AdvancedTradingStrategy from './AdvancedTradingStrategy';

const TradingSection = ({ marketData, lstmPrediction, riskMetrics, currentPosition, onRiskMetricsUpdate }) => (
  <div className="mt-6">
    <h2 className="text-2xl font-semibold mb-4">Negociação</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RiskManagement 
        marketData={marketData}
        currentPosition={currentPosition}
        onRiskMetricsUpdate={onRiskMetricsUpdate}
      />
      <AdvancedTradingStrategy
        marketData={marketData}
        lstmPrediction={lstmPrediction}
        riskMetrics={riskMetrics}
      />
    </div>
  </div>
);

export default TradingSection;