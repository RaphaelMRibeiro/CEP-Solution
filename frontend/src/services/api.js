import config from '@/config';

const API_BASE_URL = config.API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.erro || `Erro HTTP: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  async listarUsuarios() {
    return this.request('');
  }

  async buscarUsuarioPorId(id) {
    return this.request(`/${id}`);
  }

  async buscarUsuarioPorCpf(cpf) {
    return this.request(`/cpf/${cpf}`);
  }

  async criarUsuario(usuario) {
    return this.request('', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
  }

  async criarUsuarioComCep(dados) {
    return this.request('/com-cep', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  async atualizarUsuario(id, usuario) {
    return this.request(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    });
  }

  async deletarUsuario(id) {
    return this.request(`/${id}`, {
      method: 'DELETE',
    });
  }
}

const apiService = new ApiService();

export default apiService;

