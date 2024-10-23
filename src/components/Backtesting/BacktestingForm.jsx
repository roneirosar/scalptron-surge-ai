import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const BacktestingForm = ({ params, handleParamChange, onOptimize }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
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
        <Label>Risco Máximo por Trade (%)</Label>
        <Slider
          name="maxRiskPerTrade"
          min={0.1}
          max={5}
          step={0.1}
          value={[params.maxRiskPerTrade]}
          onValueChange={(value) => handleParamChange({ 
            target: { name: 'maxRiskPerTrade', value: value[0] } 
          })}
        />
        <span className="text-sm">{params.maxRiskPerTrade.toFixed(1)}%</span>
      </div>
    </div>
    <Button onClick={onOptimize} className="w-full">
      Otimizar Parâmetros
    </Button>
  </div>
);

export default BacktestingForm;