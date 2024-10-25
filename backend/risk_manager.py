import numpy as np
from scipy import stats
from dataclasses import dataclass
from typing import List, Dict, Optional
import pandas as pd

@dataclass
class RiskMetrics:
    var_95: float
    cvar_95: float
    volatility: float
    sharpe_ratio: float
    max_drawdown: float
    kelly_fraction: float
    risk_level: str

class RiskManager:
    def __init__(self, risk_free_rate: float = 0.02):
        self.risk_free_rate = risk_free_rate
        
    def calculate_metrics(self, returns: np.ndarray) -> RiskMetrics:
        volatility = self._calculate_volatility(returns)
        var_95 = self._calculate_var(returns, 0.95)
        cvar_95 = self._calculate_cvar(returns, var_95)
        sharpe_ratio = self._calculate_sharpe_ratio(returns)
        max_drawdown = self._calculate_max_drawdown(returns)
        kelly_fraction = self._calculate_kelly_fraction(returns)
        risk_level = self._assess_risk_level(volatility, var_95, sharpe_ratio)
        
        return RiskMetrics(
            var_95=var_95,
            cvar_95=cvar_95,
            volatility=volatility,
            sharpe_ratio=sharpe_ratio,
            max_drawdown=max_drawdown,
            kelly_fraction=kelly_fraction,
            risk_level=risk_level
        )
    
    def _calculate_volatility(self, returns: np.ndarray) -> float:
        return np.std(returns) * np.sqrt(252)
    
    def _calculate_var(self, returns: np.ndarray, confidence: float) -> float:
        return np.percentile(returns, (1 - confidence) * 100)
    
    def _calculate_cvar(self, returns: np.ndarray, var: float) -> float:
        return np.mean(returns[returns <= var])
    
    def _calculate_sharpe_ratio(self, returns: np.ndarray) -> float:
        excess_returns = returns - self.risk_free_rate/252
        return np.sqrt(252) * np.mean(excess_returns) / np.std(excess_returns)
    
    def _calculate_max_drawdown(self, returns: np.ndarray) -> float:
        cumulative = (1 + returns).cumprod()
        running_max = np.maximum.accumulate(cumulative)
        drawdowns = (running_max - cumulative) / running_max
        return np.max(drawdowns)
    
    def _calculate_kelly_fraction(self, returns: np.ndarray) -> float:
        win_rate = len(returns[returns > 0]) / len(returns)
        avg_win = np.mean(returns[returns > 0])
        avg_loss = abs(np.mean(returns[returns < 0]))
        return (win_rate * avg_win - (1 - win_rate) * avg_loss) / avg_win
    
    def _assess_risk_level(self, volatility: float, var: float, sharpe: float) -> str:
        risk_score = (
            0.4 * (volatility / 0.2) +  # Normalize by typical annual volatility
            0.4 * (abs(var) / 0.02) +   # Normalize by typical VaR
            0.2 * (1 / max(sharpe, 0.1)) # Higher Sharpe ratio means lower risk
        )
        
        if risk_score > 1.5:
            return "Alto"
        elif risk_score > 1.0:
            return "Médio-Alto"
        elif risk_score > 0.5:
            return "Médio"
        return "Baixo"
    
    def calculate_position_size(self, 
                              capital: float,
                              risk_metrics: RiskMetrics,
                              max_risk_per_trade: float = 0.02) -> float:
        """
        Calculate optimal position size based on risk metrics and capital
        """
        adjusted_risk = max_risk_per_trade * (1 - min(risk_metrics.volatility, 0.5))
        kelly_adjusted = min(risk_metrics.kelly_fraction, 0.2)  # Cap Kelly at 20%
        
        if risk_metrics.risk_level == "Alto":
            return 0  # No trading in high risk conditions
        
        position_size = capital * adjusted_risk * kelly_adjusted
        return min(position_size, capital * 0.2)  # Never risk more than 20% of capital