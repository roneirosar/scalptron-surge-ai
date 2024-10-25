import asyncio
import aiohttp
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import MetaTrader5 as mt5
from typing import List, Dict, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarketDataFetcher:
    def __init__(self):
        self.connected = False
        self.initialize_mt5()
        
    def initialize_mt5(self) -> bool:
        try:
            if not mt5.initialize():
                logger.error(f"MT5 initialization failed: {mt5.last_error()}")
                return False
            
            self.connected = True
            logger.info("MT5 successfully connected")
            return True
            
        except Exception as e:
            logger.error(f"Error initializing MT5: {str(e)}")
            return False
    
    async def fetch_ohlcv(self, 
                         symbol: str,
                         timeframe: mt5.TIMEFRAME_M1,
                         num_candles: int = 1000) -> Optional[pd.DataFrame]:
        """
        Fetch OHLCV data from MT5
        """
        try:
            if not self.connected:
                if not self.initialize_mt5():
                    return None
                
            rates = mt5.copy_rates_from_pos(symbol, timeframe, 0, num_candles)
            if rates is None:
                logger.error(f"Failed to get market data: {mt5.last_error()}")
                return None
            
            df = pd.DataFrame(rates)
            df['time'] = pd.to_datetime(df['time'], unit='s')
            return df
            
        except Exception as e:
            logger.error(f"Error fetching OHLCV data: {str(e)}")
            return None
    
    async def fetch_order_book(self, symbol: str) -> Optional[Dict]:
        """
        Fetch order book data from MT5
        """
        try:
            book = mt5.market_book_get(symbol)
            if book is None:
                logger.error(f"Failed to get order book: {mt5.last_error()}")
                return None
            
            asks = [{'price': ask.price, 'volume': ask.volume} 
                   for ask in book if ask.type == mt5.BOOK_TYPE_SELL]
            bids = [{'price': bid.price, 'volume': bid.volume} 
                   for bid in book if bid.type == mt5.BOOK_TYPE_BUY]
            
            return {
                'asks': asks,
                'bids': bids,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error fetching order book: {str(e)}")
            return None
    
    async def fetch_tick_data(self, symbol: str, num_ticks: int = 1000) -> Optional[pd.DataFrame]:
        """
        Fetch latest tick data from MT5
        """
        try:
            ticks = mt5.copy_ticks_from_pos(symbol, 0, num_ticks, mt5.COPY_TICKS_ALL)
            if ticks is None:
                logger.error(f"Failed to get tick data: {mt5.last_error()}")
                return None
            
            df = pd.DataFrame(ticks)
            df['time'] = pd.to_datetime(df['time'], unit='s')
            return df
            
        except Exception as e:
            logger.error(f"Error fetching tick data: {str(e)}")
            return None
    
    def __del__(self):
        if self.connected:
            mt5.shutdown()
            logger.info("MT5 connection closed")