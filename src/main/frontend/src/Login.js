import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setAuth }) {
    const [form, setForm] = useState({ userAccountId: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 로그인 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            // 로그인 로직에서 http://localhost:8080 이부분 적지 않아도 되도록 만들기
            const response = await axios.post("http://localhost:8080/api/account/login", form);
            if (response.data.isSuccess === true) {

                alert("로그인 성공! 메인화면으로 이동합니다.");
                setAuth(true);
                navigate("/home");
            } else {

                alert(response.data.message);
            }
        } catch (err) {
            alert("로그인 실패: " + err.response.data);
        }
    };

    // 회원가입 페이지로 이동
    const goToSignup = () => {
        navigate("/signup");
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="userAccountId" placeholder="아이디" value={form.userAccountId} onChange={handleChange} required />
            <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
            <button type="submit">로그인</button>

            {/* 회원가입 페이지 이동 버튼 */}
            <button type="button" onClick={goToSignup}>회원가입</button>
        </form>
    );
}

export default Login;
