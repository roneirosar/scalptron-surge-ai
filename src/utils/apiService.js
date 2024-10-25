import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8000';

export const fetchMarketData = async (symbol = 'EURUSD') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/market-data/${symbol}`);
    return response.data;
  } catch (error) {
    toast.error('Erro ao carregar dados do mercado: ' + (error.response?.data?.detail || error.message));
    throw error;
  }
};

export const fetchBacktestResults = async (params) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/backtest`, params);
    return response.data;
  } catch (error) {
    toast.error('Erro ao executar backtesting: ' + (error.response?.data?.detail || error.message));
    throw error;
  }
};