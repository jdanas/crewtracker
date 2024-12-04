// src/utils/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000'
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

export default axiosInstance;