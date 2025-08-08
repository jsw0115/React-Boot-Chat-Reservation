// src/utils/api.js
import axios from 'axios';
import { getToken, removeToken } from './auth';
import { message } from 'antd';

export const API_BASE_URL = 'http://localhost:8080/api';

const TOKEN_KEY = 'accessToken'; 

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
        const token = localStorage.getItem(TOKEN_KEY);
        // const token = localStorage.getItem('jwtToken');

        if (token) {
            //setIsAuth(true);
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // React 상태(state)를 여기서 제어하면 안 됨
        //setIsLoading(false);

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
        // 에러 응답이 있고, 401 상태 코드일 경우
        if (error.response && error.response.status === 401) {
            const originalRequest = error.config; // 원래 요청 정보를 가져옵니다.

            // ✅ 원래 요청이 로그인 API였다면, 전역 처리를 하지 않고 에러를 그대로 반환합니다.
            //    이렇게 해야 Login.js의 catch 블록에서 에러를 개별적으로 처리할 수 있습니다.
            if (originalRequest.url.includes('/account/jwtLogin')) {
                return Promise.reject(error);
            }

            // 그 외 모든 API의 401 에러는 '인증 만료'로 간주하고 로그인 페이지로 보냅니다.
            localStorage.removeItem(TOKEN_KEY);
            message.error('인증이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;