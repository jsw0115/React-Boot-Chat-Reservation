// src/utils/api.js
import axios from 'axios';
import { getToken, removeToken } from './auth';
import { message } from 'antd';

export const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        //const token = getToken();
        // localStorage에서 토큰을 가져옵니다.
        const token = localStorage.getItem('jwtToken');

        if (token) {
            //config.headers.Authorization = `Bearer ${token}`;
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            removeToken();
            message.error('세션이 만료되었거나 인증되지 않았습니다. 다시 로그인해주세요.');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;