import React from 'react';
import Backtesting from './Backtesting/Backtesting';

const BacktestingSection = ({ marketData, lstmModel }) => (
  <div className="mt-6">
    <h2 className="text-2xl font-semibold mb-4">Backtesting</h2>
    <Backtesting marketData={marketData} lstmModel={lstmModel} />
  </div>
);

export default BacktestingSection;