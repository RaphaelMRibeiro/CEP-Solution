import config from '@/config';

export const fetchCEPFromBackend = async (cep) => {
  if (cep.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos');
  }

  try {
    const response = await fetch(`${config.CEP_API_URL}/${cep}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || data.cidade || '',
      estado: data.uf || data.estado || ''
    };
  } catch (error) {
    console.error('Erro ao buscar CEP via backend:', error);
    throw error;
  }
};

export const fetchCEPFromViaCEP = async (cep) => {
  if (cep.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos');
  }

  try {
    const response = await fetch(`${config.EXTERNAL_APIS.VIACEP}/${cep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || ''
    };
  } catch (error) {
    console.error('Erro ao buscar CEP via ViaCEP:', error);
    throw error;
  }
};

export const fetchCEP = async (cep) => {
  try {
    return await fetchCEPFromBackend(cep);
  } catch (backendError) {
    console.warn('Backend CEP falhou, tentando ViaCEP como fallback:', backendError.message);
    
    try {
      return await fetchCEPFromViaCEP(cep);
    } catch (viacepError) {
      throw new Error(`Erro ao buscar CEP: ${backendError.message}`);
    }
  }
};

