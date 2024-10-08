import React from 'react';
import MarketDataChart from './MarketDataChart';

const MarketDataSection = ({ marketData }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Dados do Mercado</h2>
    <MarketDataChart marketData={marketData} />
  </div>
);

export default MarketDataSection;