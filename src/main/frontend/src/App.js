import logo from './logo.svg';
import './App.css';
// 2025.01.26 Axios 라이브러리 설치
// import {useEffect, useState} from "react";
// import axios from "axios";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from "./pages/account/Signup";
import Login from "./pages/account/Login";
import FindId from "./pages/account/FindId";
import ResetPassword from "./pages/account/ResetPassword";
import Home from "./Home";
import ChatList from './pages/chat/ChatList';   // ← 채팅방 목록 페이지
import ChatRoom from './pages/chat/ChatRoom';
import ManageRoutine from './pages/manage-routine/ManageRoutine';
import CreateManageRoutine from './pages/manage-routine/CreateManageRoutine';
import MyCalendar from './pages/scheduler/MyCalendar';
import { getToken, removeToken } from './utils/auth'; // auth.js에서 함수 임포트
//const cors = require('cors')

//app.use(cors({ credentials: true, origin: "http://localhost:8080" }));

function App() {

    const [hello, setHello] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // 앱 로드 시 로컬 스토리지에서 토큰 확인
        if (getToken()) {
            setIsAuthenticated(true);
        }
    }, []);

    // 로그인 상태 업데이트 함수
    const setAuthStatus = (status) => {
        setIsAuthenticated(status);
    };

    // 로그아웃 핸들러
    const handleLogout = () => {
        removeToken(); // 토큰 삭제
        setIsAuthenticated(false);
        // 필요시 백엔드 로그아웃 API 호출 (JWT는 stateless하므로 필수는 아님)
        message.info("로그아웃 되었습니다.");
        //navigate("/login"); // 로그아웃 후 로그인 페이지로 이동
    };
    
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                {/*<Route path="/login" element={<Login setAuth={setAuth} />} />*/}
                <Route path="/login" element={<Login setAuth={setAuthStatus} />} />
                <Route path="/manage-routine" element={<ManageRoutine />} />
                <Route path="/create-manage-routine" element={<CreateManageRoutine />} />
                <Route path="/find-id" element={<FindId />} />
                <Route path="/reset-password/:token?" element={<ResetPassword />} /> {/* 토큰 파라미터 추가 */}

                {/* 인증이 필요한 라우트 */}
                <Route
                    path="/home"
                    element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                {/* 기본 경로를 로그인 페이지로 리디렉션 */}
                <Route path="/" element={<Navigate to="/login" />} />
                {/* 기타 보호된 라우트들... */}
                {/*<Route path="/" element={<Login setAuth={setAuth} />} />*/}
                <Route path="/scheduler" element={<MyCalendar />} />
                {/*<Route path="/ChatList" element={<ChatList />} />*/}
                <Route path="/chat/:roomId" element={<ChatRoom />} />
                <Route path="/find-id" element={<FindId />} /> {/* 아이디 찾기 경로 추가 */}
                <Route path="/reset-password" element={<ResetPassword />} /> {/* 비밀번호 재설정 경로 추가 */}
            </Routes>
        </Router>
    );
    /*
    useEffect(() => {
        axios.get('http://localhost:8080/api/account')
            .then((res) => {
                console.log("res ? " + res);
                setHello(res.data);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);
    return (
        <div className="App">
            백엔드에서 받은 데이터: {hello}
            {error && <p>Error: {error}</p>}
        </div>
    );
    */
    /*
    return (
        <div className="App">
                <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
  */
}

export default App;
