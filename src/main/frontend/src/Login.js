import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Space } from "antd"; // Space 컴포넌트 추가
import { UserOutlined, LockOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons'; // 아이콘 임포트
import './Login.css'; // 기존 CSS 파일 임포트

const { Title } = Typography;

const API_BASE_URL = 'http://localhost:8080/api';

function Login({ setAuth }) {
  const [loadingLocal, setLoadingLocal] = useState(false); // 로컬 로그인 로딩 상태
  const [loadingJwt, setLoadingJwt] = useState(false);     // JWT 로그인 로딩 상태
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 로컬 로그인 핸들러
  const handleLocalLogin = async () => {
    setLoadingLocal(true); // 로컬 로그인 로딩 시작
    try {
      const values = await form.validateFields(); // 폼 필드 유효성 검사
      const { userAccountId, password } = values;

      const response = await axios.post(`${API_BASE_URL}/account/login`, {
        userAccountId,
        password,
      }, {
        withCredentials: true, // 쿠키 전송 허용
      });

      if (response.data.isSuccess) {
        message.success("로컬 로그인 성공! 메인화면으로 이동합니다.");
        setAuth(true);
        navigate("/home");
      } else {
        throw new Error(response.data.message || "로그인 실패");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "로컬 로그인 중 오류가 발생했습니다.";
      message.error("로컬 로그인 실패: " + errorMessage);
    } finally {
      setLoadingLocal(false); // 로컬 로그인 로딩 종료
    }
  };

  // JWT 로그인 핸들러
  const handleJwtLogin = async () => {
    setLoadingJwt(true); // JWT 로그인 로딩 시작
    try {
      const values = await form.validateFields(); // 폼 필드 유효성 검사
      const { userAccountId, password } = values;

      const res = await axios.post(`${API_BASE_URL}/account/jwtLogin`, {
        userAccountId,
        password,
      });
      localStorage.setItem("token", res.data.token); // 토큰 저장
      message.success("JWT 로그인 성공! 메인화면으로 이동합니다.");
      setAuth(true);
      navigate("/home");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "JWT 로그인 중 오류가 발생했습니다.";
      message.error("JWT 로그인 실패: " + errorMessage);
    } finally {
      setLoadingJwt(false); // JWT 로그인 로딩 종료
    }
  };

  // 회원가입 페이지 이동
  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2}>로그인</Title>
        </div>
        <Form
          form={form}
          name="login_form"
          initialValues={{ remember: true }}
          className="login-form"
        >
          <Form.Item
            name="userAccountId"
            rules={[{ required: true, message: '아이디를 입력해주세요!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="아이디"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="비밀번호"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}> {/* 버튼들을 세로로 정렬하고 너비 100% */}
              <Button
                type="default" // 기본 버튼 스타일 (로컬 로그인)
                onClick={handleLocalLogin}
                className="login-form-button"
                loading={loadingLocal} // 로컬 로그인 로딩 상태
                icon={<LoginOutlined />}
                size="large"
                block
              >
                로컬 로그인
              </Button>
              <Button
                type="primary" // 메인 버튼 스타일 (JWT 로그인)
                onClick={handleJwtLogin}
                className="login-form-button"
                loading={loadingJwt} // JWT 로그인 로딩 상태
                icon={<LoginOutlined />}
                size="large"
                block
              >
                JWT 로그인
              </Button>
            </Space>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Button
              type="link"
              onClick={goToSignup}
              className="signup-button"
              icon={<UserAddOutlined />}
              block // 회원가입 버튼도 블록으로
            >
              회원가입
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Login;