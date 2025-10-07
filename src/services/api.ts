import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const API_BASE = 'https://api.escuelajs.co';

// Tạo instance axios với config mặc định
const api: AxiosInstance = axios.create({
    baseURL: API_BASE, // thay bằng domain của bạn
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor xử lý request
api.interceptors.request.use(
    (config) => {
        // Ví dụ: thêm token vào header nếu có
        const token = localStorage.getItem("Token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor xử lý response
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        console.error("API Error:", error.response || error.message);
        return Promise.reject(error);
    }
);

export default api;