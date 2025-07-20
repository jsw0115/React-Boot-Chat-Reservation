// import axios from 'axios';
const TOKEN_KEY = 'jwtToken'; // 로컬 스토리지에 저장될 토큰의 키

// // 1. axios 인스턴스 생성
// const auth = axios.create({
//     // baseURL을 설정하면 요청 시 URL 앞부분을 생략할 수 있습니다.
//     // setupProxy.js를 사용 중이라면 baseURL을 설정할 필요가 없습니다.
//     // baseURL: '/api', 
//     timeout: 5000, // 요청 타임아웃
// });

// // 2. 요청 인터셉터(Request Interceptor) 설정
// //    모든 API 요청이 보내지기 전에 이 부분이 먼저 실행됩니다.
// auth.interceptors.request.use(
//     (config) => {
//         // localStorage에서 accessToken을 가져옵니다.
//         const token = localStorage.getItem(TOKEN_KEY);

//         // 토큰이 존재하면 요청 헤더에 Authorization 필드를 추가합니다.
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
        
//         // `withCredentials` 옵션은 JWT 헤더 방식과 함께 사용할 필요가 없으므로 제거하는 것이 좋습니다.
//         // config.withCredentials = false;

//         return config;
//     },
//     (error) => {
//         // 요청 에러 처리
//         return Promise.reject(error);
//     }
// );

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const checkAuthStatus = () => {
    return !!getToken(); // 토큰이 존재하면 true, 없으면 false
};

// export default auth;