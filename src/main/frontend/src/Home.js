// src/Home.js 또는 src/components/Home.js

//import React from "react";
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // 추가

function Home() {
  
  const navigate = useNavigate(); // 컴포넌트 내부에서 호출
  // 
  const Logout = async (e) => {
    
    e.preventDefault();
    try {

        // 로그아웃웃 로직에서 http://localhost:8080 이부분 적지 않아도 되도록 만들기
        const response = await axios.post("http://localhost:8080/api/account/logout");
        if (response.data.isSuccess === true) {

          localStorage.removeItem("token"); // 예시
          // 로그인 페이지로 이동
          navigate("/login");
        } else {

          alert(response.data.message);
        }
    } catch (err) {
        alert("로그아웃 실패: " + err.response.data);
    }

  }
  return (
    <div style={{ padding: "2rem" }}>
      <h1>홈페이지</h1>
      <p>로그인에 성공하셨습니다! 🎉</p>
      <p>여기에 원하는 내용을 자유롭게 추가하세요.</p>
      <button onClick={Logout}>로그아웃</button>
    </div>
  );
}

export default Home;