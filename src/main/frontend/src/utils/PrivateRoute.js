// components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from './auth';
import { AuthContext } from './AuthContext';

export default function PrivateRoute({ children }) {
    const { auth } = useContext(AuthContext);
    const token = getToken();

    if (!auth && !token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
