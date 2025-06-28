import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configuração da instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // O servidor respondeu com um status de erro
      const { status, data } = error.response;
      return Promise.reject({
        status,
        message: data.message || data.error || 'Erro na comunicação com o servidor',
        details: data.details || null
      });
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      return Promise.reject({
        status: 0,
        message: 'Servidor não está respondendo. Verifique sua conexão.',
        details: null
      });
    } else {
      // Algo aconteceu na configuração da requisição
      return Promise.reject({
        status: 0,
        message: error.message || 'Erro inesperado',
        details: null
      });
    }
  }
);

// Serviços DUV
export const duvService = {
  // Listar todas as DUVs
  getAll: () => api.get('/duvs'),
  
  // Buscar DUV por ID com passageiros
  getById: (id) => api.get(`/duvs/${id}`),
  
  // Criar nova DUV
  create: (duvData) => api.post('/duvs', duvData),
  
  // Atualizar DUV
  update: (id, duvData) => api.put(`/duvs/${id}`, duvData),
  
  // Deletar DUV
  delete: (id) => api.delete(`/duvs/${id}`),
  
  // Listar passageiros de uma DUV
  getPassageiros: (id) => api.get(`/duvs/${id}/passageiros`)
};

// Serviços Navio
export const navioService = {
  // Listar todos os navios
  getAll: () => api.get('/navios'),
  
  // Buscar navio por ID
  getById: (id) => api.get(`/navios/${id}`),
  
  // Criar novo navio
  create: (navioData) => api.post('/navios', navioData),
  
  // Atualizar navio
  update: (id, navioData) => api.put(`/navios/${id}`, navioData),
  
  // Deletar navio
  delete: (id) => api.delete(`/navios/${id}`)
};

// Serviços Pessoa
export const pessoaService = {
  // Listar todas as pessoas
  getAll: () => api.get('/pessoas'),
  
  // Buscar pessoa por ID
  getById: (id) => api.get(`/pessoas/${id}`),
  
  // Criar nova pessoa
  create: (pessoaData) => api.post('/pessoas', pessoaData),
  
  // Atualizar pessoa
  update: (id, pessoaData) => api.put(`/pessoas/${id}`, pessoaData),
  
  // Deletar pessoa
  delete: (id) => api.delete(`/pessoas/${id}`),
  
  // Filtrar por tipo
  getByTipo: (tipo) => api.get(`/pessoas/tipo/${tipo}`)
};

// Hook personalizado para tratamento de erros
export const useApiError = () => {
  const handleError = (error) => {
    if (error.status === 404) {
      return 'Recurso não encontrado';
    } else if (error.status === 400) {
      return error.message || 'Dados inválidos';
    } else if (error.status === 500) {
      return 'Erro interno do servidor';
    } else if (error.status === 0) {
      return error.message;
    } else {
      return 'Erro inesperado';
    }
  };

  return { handleError };
};

export default api;