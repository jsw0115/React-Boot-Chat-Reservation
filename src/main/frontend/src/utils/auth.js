// import axios from 'axios';
const TOKEN_KEY = 'jwtToken'; // 로컬 스토리지에 저장될 토큰의 키

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