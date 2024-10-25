import pandas as pd
import numpy as np
from typing import List, Dict, Optional
import talib
from dataclasses import dataclass

@dataclass
class TechnicalIndicators:
    sma: np.ndarray
    ema: np.ndarray
    rsi: np.ndarray
    macd: Dict[str, np.ndarray]
    bollinger: Dict[str, np.ndarray]
    atr: np.ndarray
    adx: np.ndarray
    stoch: Dict[str, np.ndarray]

class DataProcessor:
    def __init__(self):
        self.required_columns = ['open', 'high', 'low', 'close', 'volume']
    
    def validate_data(self, df: pd.DataFrame) -> bool:
        """
        Validate that DataFrame has required columns
        """
        return all(col in df.columns for col in self.required_columns)
    
    def calculate_indicators(self, df: pd.DataFrame) -> Optional[TechnicalIndicators]:
        """
        Calculate all technical indicators
        """
        if not self.validate_data(df):
            raise ValueError("DataFrame missing required columns")
        
        try:
            # Moving Averages
            sma_20 = talib.SMA(df['close'], timeperiod=20)
            ema_20 = talib.EMA(df['close'], timeperiod=20)
            
            # RSI
            rsi = talib.RSI(df['close'], timeperiod=14)
            
            # MACD
            macd, signal, hist = talib.MACD(df['close'])
            macd_dict = {
                'macd': macd,
                'signal': signal,
                'histogram': hist
            }
            
            # Bollinger Bands
            upper, middle, lower = talib.BBANDS(df['close'])
            bollinger_dict = {
                'upper': upper,
                'middle': middle,
                'lower': lower
            }
            
            # ATR
            atr = talib.ATR(df['high'], df['low'], df['close'], timeperiod=14)
            
            # ADX
            adx = talib.ADX(df['high'], df['low'], df['close'], timeperiod=14)
            
            # Stochastic
            slowk, slowd = talib.STOCH(df['high'], df['low'], df['close'])
            stoch_dict = {
                'k': slowk,
                'd': slowd
            }
            
            return TechnicalIndicators(
                sma=sma_20,
                ema=ema_20,
                rsi=rsi,
                macd=macd_dict,
                bollinger=bollinger_dict,
                atr=atr,
                adx=adx,
                stoch=stoch_dict
            )
            
        except Exception as e:
            print(f"Error calculating indicators: {str(e)}")
            return None
    
    def prepare_model_data(self, 
                          df: pd.DataFrame, 
                          indicators: TechnicalIndicators,
                          sequence_length: int = 60) -> tuple:
        """
        Prepare data for LSTM model
        """
        feature_data = pd.DataFrame({
            'close': df['close'],
            'volume': df['volume'],
            'rsi': indicators.rsi,
            'macd': indicators.macd['macd'],
            'atr': indicators.atr,
            'adx': indicators.adx
        }).dropna()
        
        # Create sequences
        sequences = []
        targets = []
        
        for i in range(len(feature_data) - sequence_length):
            sequences.append(feature_data.iloc[i:i+sequence_length].values)
            targets.append(feature_data['close'].iloc[i+sequence_length])
        
        return np.array(sequences), np.array(targets)