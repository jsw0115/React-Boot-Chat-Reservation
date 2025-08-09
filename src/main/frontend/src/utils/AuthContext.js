// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getToken } from './auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
    if (getToken()) {
        setAuth(true); // 토큰이 있으면 로그인 상태 복구
    }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
