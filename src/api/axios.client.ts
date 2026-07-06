import axios from 'axios';

// Lấy base URL từ biến môi trường Vite (.env), fallback về localhost nếu chưa set
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout sau 10s
});

// Interceptor cho Request: Tự động đính kèm Token nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Xử lý lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Cần đăng nhập lại.');
      // Xử lý logout nếu cần
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosClient;