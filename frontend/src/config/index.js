export const config = {
  API_BASE_URL: 'http://localhost:8080/api/usuarios',
  
  CEP_API_URL: 'http://localhost:8080/api/cep',
  
  REQUEST_TIMEOUT: 10000,
  
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  VALIDATION: {
    CPF_REQUIRED: true,
    CEP_REQUIRED: true,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
  },
  
  EXTERNAL_APIS: {
    VIACEP: 'https://viacep.com.br/ws',
  },
  
  QUERY: {
    STALE_TIME: 5 * 60 * 1000, 
    GC_TIME: 10 * 60 * 1000,
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000,
  },
};

export default config;

