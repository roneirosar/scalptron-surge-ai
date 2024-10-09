import React from 'react';
import TradesList from './TradesList';
import TradingStatistics from './TradingStatistics';
import PerformanceMetrics from './PerformanceMetrics';
import RealTimePerformance from './RealTimePerformance';

const PerformanceSection = ({ trades, performanceMetrics }) => (
  <div className="mt-6">
    <h2 className="text-2xl font-semibold mb-4">Desempenho</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RealTimePerformance performanceMetrics={performanceMetrics} trades={trades} />
      <TradesList trades={trades} />
      <TradingStatistics trades={trades} />
      <PerformanceMetrics metrics={performanceMetrics} />
    </div>
  </div>
);

export default PerformanceSection;