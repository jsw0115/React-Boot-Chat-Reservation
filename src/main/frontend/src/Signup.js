import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Signup() {

    const [form, setForm] = useState({
        userAccountId: "", password: "", email: "", name: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            await axios.post("/sewon/api/account/register", form);
            alert("회원가입 성공~ 로그인 페이지로 이동합니다.");
            navigate("/login");
        } catch (err) {
            alert(err.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="userAccountId" placeholder="아이디" value={form.userAccountId} onChange={handleChange} required />
            <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
            <input name="email" type="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
            <input name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
            <button type="submit">회원가입</button>
        </form>
    );
}
export default Signup;