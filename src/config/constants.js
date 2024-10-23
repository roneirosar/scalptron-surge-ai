export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const MT5_CONFIG = {
  CHECK_INTERVAL: 30000, // 30 segundos
  RECONNECT_ATTEMPTS: 3,
};

export const PROJECT_STATUS = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in-progress',
  PENDING: 'pending',
};