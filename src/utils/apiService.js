import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para retry em caso de falha
api.interceptors.response.use(null, async (error) => {
  const maxRetries = 3;
  let retryCount = error.config?.retryCount || 0;

  if (retryCount < maxRetries && error.code !== 'ECONNABORTED') {
    error.config.retryCount = retryCount + 1;
    const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return api(error.config);
  }

  return Promise.reject(error);
});

export const fetchMarketData = async () => {
  try {
    const response = await api.get('/market-data');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erro ao conectar com o servidor';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const checkMT5Connection = async () => {
  try {
    const response = await api.get('/mt5-status');
    return response.data;
  } catch (error) {
    toast.error('Erro ao verificar conexão com MT5');
    throw error;
  }
};