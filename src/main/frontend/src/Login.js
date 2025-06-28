import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:8080/api'; // 예시: 스프링 부트 백엔드 API 주소
const token = localStorage.getItem("token"); // 이걸 추가해야 함

function Login({ setAuth }) {
  const [form, setForm] = useState({
    userAccountId: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 기존 로그인 핸들러 (세션 로그인 or 쿠키 로그인 등)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // `${API_BASE_URL}/account/login`
      const response = await axios.post(`${API_BASE_URL}/account/login`, form, {
    // const response = await axios.post("/api/account/login", form, {
        withCredentials: true, // 쿠키 전송 허용 (필요시)
      });
      if (response.data.isSuccess) {
        alert("로그인 성공! 메인화면으로 이동합니다.");
        setAuth(true);
        navigate("/home");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("로그인 실패: " + (err.response?.data?.message || err.message));
    }
  };

  // JWT 로그인 핸들러
  const handleJwtLogin = async () => {
    try {
      
        const res = await axios.post(`${API_BASE_URL}/account/jwtLogin`, form, {
        //const res = await axios.post("/api/account/jwt-login", {
            userAccountId: form.userAccountId, // 백엔드 DTO 필드명과 동일하게
            password: form.password,
        });
      localStorage.setItem("token", res.data.token); // 토큰 저장
      alert("JWT 로그인 성공");
      setAuth(true);   // 인증 상태 갱신
      navigate("/home");  // 로그인 후 홈 이동
    } catch (err) {
      alert("JWT 로그인 실패: " + (err.response?.data?.message || err.message));
    }
  };

  // 회원가입 페이지 이동
  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="userAccountId"
        placeholder="아이디"
        value={form.userAccountId}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
        required
      />

      <button type="submit">기존 로그인</button>
      <button type="button" onClick={handleJwtLogin}>
        JWT 로그인
      </button>

      <button type="button" onClick={goToSignup}>
        회원가입
      </button>
    </form>
  );
}

export default Login;
