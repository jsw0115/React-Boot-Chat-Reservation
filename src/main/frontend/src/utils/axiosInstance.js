import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
import { message } from 'antd';

// 1. axios 인스턴스 생성
const axiosInstance = axios.create({
    // baseURL을 설정하면 요청 시 URL 앞부분을 생략할 수 있습니다.
    // setupProxy.js를 사용 중이라면 baseURL을 설정할 필요가 없습니다.
    // baseURL: '/api', 
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // 요청 타임아웃
});

// 2. 요청 인터셉터(Request Interceptor) 설정
//    모든 API 요청이 보내지기 전에 이 부분이 먼저 실행됩니다.
axiosInstance.interceptors.request.use(
    (config) => {
        // localStorage에서 accessToken을 가져옵니다.
        const token = localStorage.getItem('jwtToken');

        // 토큰이 존재하면 요청 헤더에 Authorization 필드를 추가합니다.
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // `withCredentials` 옵션은 JWT 헤더 방식과 함께 사용할 필요가 없으므로 제거하는 것이 좋습니다.
        // config.withCredentials = false;

        return config;
    },
    (error) => {
        // 요청 에러 처리
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
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

export default axiosInstance;