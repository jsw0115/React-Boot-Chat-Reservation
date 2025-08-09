import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from "./pages/account/Signup";
import Login from "./pages/account/Login";
import FindId from "./pages/account/FindId";
import ResetPassword from "./pages/account/ResetPassword";
import Home from "./Home";
import ChatList from './pages/chat/ChatList';
import ChatRoom from './pages/chat/ChatRoom';
import ManageRoutine from './pages/manage-routine/ManageRoutine';
import CreateManageRoutine from './pages/manage-routine/CreateManageRoutine';
import MyCalendar from './pages/scheduler/MyCalendar';
import { getToken, removeToken } from './utils/auth';
import { message } from 'antd'; // 로그아웃 메시지

function App() {
    // const [auth, setAuth] = useState(false);

    // // 앱 시작 시 토큰 확인해서 로그인 상태 복구
    // useEffect(() => {
    //     if (getToken()) {
    //         setAuth(true);
    //     }
    // }, []);
    const [auth, setAuth] = useState(() => !!getToken());

    useEffect(() => {
        if (getToken()) {
            setAuth(true);
        }
    }, []);

    // 로그아웃 처리
    const handleLogout = () => {
        removeToken();
        setAuth(false);
        message.info("로그아웃 되었습니다.");
    };

    // 보호 라우트 컴포넌트
    const PrivateRoute = ({ children }) => {
        return auth ? children : <Navigate to="/login" replace />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login setAuth={setAuth} />} />
                <Route path="/find-id" element={<FindId />} />
                <Route path="/reset-password/:token?" element={<ResetPassword />} />

                {/* 보호된 라우트 */}
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/manage-routine"
                    element={
                        <PrivateRoute>
                            <ManageRoutine />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/create-manage-routine"
                    element={
                        <PrivateRoute>
                            <CreateManageRoutine />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/scheduler"
                    element={
                        <PrivateRoute>
                            <MyCalendar />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/chat/:roomId"
                    element={
                        <PrivateRoute>
                            <ChatRoom />
                        </PrivateRoute>
                    }
                />

                {/* 기본 경로 */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
