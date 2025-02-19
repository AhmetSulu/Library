import axios from 'axios';

const BASE_URL = 'https://chilly-dody-shock-995d4b78.koyeb.app/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
  
  interceptors: {
    response: {
      use: (response) => response,
      error: (error) => {
        if (error.response?.status === 401) {
          
        }
        return Promise.reject(error);
      }
    }
  }
});

const createAPI = (endpoint) => ({
  getAll: () => api.get(`/${endpoint}`),
  getById: (id) => api.get(`/${endpoint}/${id}`),
  create: (data) => api.post(`/${endpoint}`, data),
  update: (id, data) => api.put(`/${endpoint}/${id}`, data),
  delete: (id) => api.delete(`/${endpoint}/${id}`)
});

export const publishersAPI = createAPI('publishers');
export const categoriesAPI = createAPI('categories');
export const booksAPI = createAPI('books');
export const authorsAPI = createAPI('authors');
export const borrowsAPI = createAPI('borrows');