import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setAuth }) {
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/sewon/api/account/login", form);
            alert("로그인 성공!");
            setAuth(true);
            navigate("/home");
        } catch (err) {
            alert("로그인 실패: " + err.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="userAccountId" placeholder="아이디" value={form.userAccountId} onChange={handleChange} required />
            <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
            <button type="submit">로그인</button>
        </form>
    );
}

export default Login;
