import { useQuery } from '@tanstack/react-query';
import { fetchCEPFromBackend, fetchCEPFromViaCEP } from '@/services/cep';
import config from '@/config';

export const useCEPQuery = (cep, options = {}) => {
  const cleanCEP = cep?.replace(/\D/g, '') || '';
  
  return useQuery({
    queryKey: ['cep', cleanCEP],
    queryFn: async () => {
      if (cleanCEP.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos');
      }

      try {
        return await fetchCEPFromBackend(cleanCEP);
      } catch (backendError) {
        console.warn('Backend CEP falhou, tentando ViaCEP como fallback:', backendError.message);
        
        return await fetchCEPFromViaCEP(cleanCEP);
      }
    },
    enabled: cleanCEP.length === 8 && options.enabled !== false,
    staleTime: config.QUERY.STALE_TIME,
    gcTime: config.QUERY.GC_TIME,
    retry: (failureCount, error) => {
      if (error.message.includes('CEP deve ter 8 dígitos') || 
          error.message.includes('CEP não encontrado')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: config.QUERY.RETRY_DELAY,
    ...options,
  });
};

export const useCEPBackendQuery = (cep, options = {}) => {
  const cleanCEP = cep?.replace(/\D/g, '') || '';
  
  return useQuery({
    queryKey: ['cep-backend', cleanCEP],
    queryFn: () => fetchCEPFromBackend(cleanCEP),
    enabled: cleanCEP.length === 8 && options.enabled !== false,
    staleTime: config.QUERY.STALE_TIME,
    gcTime: config.QUERY.GC_TIME,
    retry: (failureCount, error) => {
      if (error.message.includes('CEP deve ter 8 dígitos') || 
          error.message.includes('CEP não encontrado')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: config.QUERY.RETRY_DELAY,
    ...options,
  });
};

export const useCEPViaCEPQuery = (cep, options = {}) => {
  const cleanCEP = cep?.replace(/\D/g, '') || '';
  
  return useQuery({
    queryKey: ['cep-viacep', cleanCEP],
    queryFn: () => fetchCEPFromViaCEP(cleanCEP),
    enabled: cleanCEP.length === 8 && options.enabled !== false,
    staleTime: config.QUERY.STALE_TIME,
    gcTime: config.QUERY.GC_TIME,
    retry: (failureCount, error) => {
      if (error.message.includes('CEP deve ter 8 dígitos') || 
          error.message.includes('CEP não encontrado')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: config.QUERY.RETRY_DELAY,
    ...options,
  });
};

