// src/utils/api.js
import axios from 'axios';
import { getToken, removeToken } from './auth';
import { message } from 'antd';

export const API_BASE_URL = 'http://localhost:8080/api';

const TOKEN_KEY = 'jwtToken'; 

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        // getToken() 반환값을 변수에 저장
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // 주의: 여기서는 React state(setIsLoading 등)를 호출하면 안 됩니다.
        console.log('요청 Authorization:', config.headers['Authorization']);

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
        // 에러 객체에 response가 없을 수 있으니 안전하게 접근
        const status = error?.response?.status;
        const originalRequest = error?.config || {};

        // 로그인 페이지로 리다이렉트 
        if (status === 401) {
            
            // 로그인 API 자체의 401은 로그인 컴포넌트가 처리하도록 그대로 reject
            if (originalRequest?.url?.includes('/account/jwtLogin')) {
                return Promise.reject(error);
            }

            // 아니면 전역 로그아웃 처리
            try {
                removeToken();
            } catch (e) {

            }
            // removeToken();
            message.error('인증이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// api.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         // 에러 응답이 있고, 401 상태 코드일 경우
//         if (error.response && error.response.status === 401) {
//             const originalRequest = error.config; // 원래 요청 정보를 가져옵니다.

//             // ✅ 원래 요청이 로그인 API였다면, 전역 처리를 하지 않고 에러를 그대로 반환합니다.
//             //    이렇게 해야 Login.js의 catch 블록에서 에러를 개별적으로 처리할 수 있습니다.
//             if (originalRequest.url.includes('/account/jwtLogin')) {
//                 return Promise.reject(error);
//             }

//             // 그 외 모든 API의 401 에러는 '인증 만료'로 간주하고 로그인 페이지로 보냅니다.
//             localStorage.removeItem(TOKEN_KEY);
//             message.error('인증이 만료되었습니다. 다시 로그인해주세요.');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default api;