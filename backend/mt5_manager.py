import MetaTrader5 as mt5
import logging
from datetime import datetime
import os
from dotenv import load_dotenv

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='mt5_connection.log'
)

class MT5Manager:
    def __init__(self):
        load_dotenv()
        self.connected = False
        self.last_error = None
        self.initialize_connection()

    def initialize_connection(self):
        try:
            if not mt5.initialize():
                self.last_error = f"MT5 initialization failed: {mt5.last_error()}"
                logging.error(self.last_error)
                return False
            
            # Tentar login se credenciais estiverem disponíveis
            login = os.getenv('MT5_LOGIN')
            password = os.getenv('MT5_PASSWORD')
            server = os.getenv('MT5_SERVER')
            
            if all([login, password, server]):
                if not mt5.login(login=int(login), password=password, server=server):
                    self.last_error = f"MT5 login failed: {mt5.last_error()}"
                    logging.error(self.last_error)
                    return False
            
            self.connected = True
            logging.info("MT5 successfully connected")
            return True
            
        except Exception as e:
            self.last_error = f"MT5 connection error: {str(e)}"
            logging.error(self.last_error)
            return False

    def get_connection_status(self):
        return {
            "connected": self.connected,
            "last_error": self.last_error,
            "terminal_info": mt5.terminal_info()._asdict() if self.connected else None
        }

    def get_market_data(self, symbol, timeframe, num_candles=1000):
        try:
            if not self.connected:
                if not self.initialize_connection():
                    return None
                
            rates = mt5.copy_rates_from_pos(symbol, timeframe, 0, num_candles)
            if rates is None:
                self.last_error = f"Failed to get market data: {mt5.last_error()}"
                logging.error(self.last_error)
                return None
                
            return rates
            
        except Exception as e:
            self.last_error = f"Error getting market data: {str(e)}"
            logging.error(self.last_error)
            return None

    def __del__(self):
        if self.connected:
            mt5.shutdown()
            logging.info("MT5 connection closed")

# Criar instância global
mt5_manager = MT5Manager()