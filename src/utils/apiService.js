import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const fetchMarketData = async (symbol = 'EURUSD') => {
  try {
    const response = await api.get(`/market-data/${symbol}`);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || !error.response) {
      toast.error('Erro de conexão: Verifique se o servidor backend está rodando');
    } else {
      toast.error('Erro ao carregar dados do mercado: ' + (error.response?.data?.detail || error.message));
    }
    throw error;
  }
};

export const fetchBacktestResults = async (params) => {
  try {
    const response = await api.post('/backtest', params);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || !error.response) {
      toast.error('Erro de conexão: Verifique se o servidor backend está rodando');
    } else {
      toast.error('Erro ao executar backtesting: ' + (error.response?.data?.detail || error.message));
    }
    throw error;
  }
};