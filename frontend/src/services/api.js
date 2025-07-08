import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const login = (formData) => API.post('/users/login', formData);
export const register = (formData) => API.post('/users/register', formData);

export default API; 