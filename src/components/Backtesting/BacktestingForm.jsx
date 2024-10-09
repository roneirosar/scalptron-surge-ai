import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const BacktestingForm = ({ params, handleParamChange }) => (
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div>
      <Label htmlFor="startDate">Data de Início</Label>
      <Input
        id="startDate"
        name="startDate"
        type="date"
        value={params.startDate}
        onChange={handleParamChange}
      />
    </div>
    <div>
      <Label htmlFor="endDate">Data de Fim</Label>
      <Input
        id="endDate"
        name="endDate"
        type="date"
        value={params.endDate}
        onChange={handleParamChange}
      />
    </div>
    <div>
      <Label htmlFor="initialCapital">Capital Inicial</Label>
      <Input
        id="initialCapital"
        name="initialCapital"
        type="number"
        value={params.initialCapital}
        onChange={handleParamChange}
      />
    </div>
    <div>
      <Label htmlFor="maxRiskPerTrade">Risco Máximo por Trade (%)</Label>
      <Slider
        id="maxRiskPerTrade"
        name="maxRiskPerTrade"
        min={0.1}
        max={5}
        step={0.1}
        value={[params.maxRiskPerTrade]}
        onValueChange={(value) => handleParamChange({ target: { name: 'maxRiskPerTrade', value: value[0] } })}
      />
      <span>{params.maxRiskPerTrade.toFixed(1)}%</span>
    </div>
    <div>
      <Label htmlFor="stopLoss">Stop Loss (%)</Label>
      <Slider
        id="stopLoss"
        name="stopLoss"
        min={0.5}
        max={10}
        step={0.1}
        value={[params.stopLoss]}
        onValueChange={(value) => handleParamChange({ target: { name: 'stopLoss', value: value[0] } })}
      />
      <span>{params.stopLoss.toFixed(1)}%</span>
    </div>
    <div>
      <Label htmlFor="takeProfit">Take Profit (%)</Label>
      <Slider
        id="takeProfit"
        name="takeProfit"
        min={0.5}
        max={10}
        step={0.1}
        value={[params.takeProfit]}
        onValueChange={(value) => handleParamChange({ target: { name: 'takeProfit', value: value[0] } })}
      />
      <span>{params.takeProfit.toFixed(1)}%</span>
    </div>
    <div>
      <Label htmlFor="trailingStop">Trailing Stop (%)</Label>
      <Slider
        id="trailingStop"
        name="trailingStop"
        min={0}
        max={5}
        step={0.1}
        value={[params.trailingStop]}
        onValueChange={(value) => handleParamChange({ target: { name: 'trailingStop', value: value[0] } })}
      />
      <span>{params.trailingStop.toFixed(1)}%</span>
    </div>
    <div>
      <Label htmlFor="entryThreshold">Limiar de Entrada (%)</Label>
      <Slider
        id="entryThreshold"
        name="entryThreshold"
        min={0.1}
        max={2}
        step={0.1}
        value={[params.entryThreshold]}
        onValueChange={(value) => handleParamChange({ target: { name: 'entryThreshold', value: value[0] } })}
      />
      <span>{params.entryThreshold.toFixed(1)}%</span>
    </div>
  </div>
);

export default BacktestingForm;