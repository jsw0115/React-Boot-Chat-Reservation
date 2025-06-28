import logo from './logo.svg';
import './App.css';
// 2025.01.26 Axios 라이브러리 설치
// import {useEffect, useState} from "react";
// import axios from "axios";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import ChatList from './pages/chat/ChatList';   // ← 채팅방 목록 페이지
import ChatRoom from './pages/chat/ChatRoom';
import ManageRoutine from './pages/manage-routine/ManageRoutine';
import CreateManageRoutine from './pages/manage-routine/CreateManageRoutine';
import MyCalendar from './pages/scheduler/MyCalendar';
//const cors = require('cors')

//app.use(cors({ credentials: true, origin: "http://localhost:8080" }));

function App() {

    const [hello, setHello] = useState('');
    const [error, setError] = useState('');
    const [auth, setAuth] = useState(false);
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login setAuth={setAuth} />} />
                <Route path="/manage-routine" element={<ManageRoutine />} />
                <Route path="/create-manage-routine" element={<CreateManageRoutine />} />
                <Route path="/home" element={auth ? <Home /> : <Login setAuth={setAuth} />} />
                <Route path="/" element={<Login setAuth={setAuth} />} />
                <Route path="/scheduler" element={<MyCalendar />} />
                /*<Route path="/ChatList" element={<ChatList />} />*/
                <Route path="/chat/:roomId" element={<ChatRoom />} />
            </Routes>
        </BrowserRouter>
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
