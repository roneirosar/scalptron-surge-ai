import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Adjust this if your backend is running on a different port

export const fetchMarketData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/market-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};