import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Cambia si es otro puerto o servidor
  headers: {
    'Content-Type': 'application/json',
  }
});

export default apiClient;