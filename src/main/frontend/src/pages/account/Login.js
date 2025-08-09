import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Space } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined, UserAddOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../../utils/api'; // axios 대신 api 유틸리티 사용
import { setToken } from '../../utils/auth'; // setToken 함수 임포트
import './Login.css';

const { Title } = Typography;

function Login({ setAuth }) {
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [loadingJwt, setLoadingJwt] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // 로컬 로그인 (세션 기반 또는 쿠키 기반) 핸들러
    const handleLocalLogin = async () => {
        setLoadingLocal(true);
        try {

            // 폼의 입력 값 유효성 검사
            const values = await form.validateFields();
            const { userAccountId, password } = values;

            // `api` 유틸리티 사용 (withCredentials 설정이 api.js에 있으므로 직접 axios.post 대신 api.post 사용)
            const response = await api.post(`/account/login`, {
                userAccountId,
                password,
            });

            if (response.data.isSuccess) {
                message.success("로컬 로그인 성공! 메인화면으로 이동합니다.");
                // 로컬 로그인 시 JWT를 별도로 관리하지 않는다면 setToken 호출 불필요
                // setAuth(true)는 App.js의 상태를 업데이트하여 보호된 경로 접근 가능하게 함
                setAuth(true);
                navigate("/home");
            } else {
                // 백엔드에서 isSuccess: false와 함께 메시지를 보낼 경우
                throw new Error(response.data.message || "로그인 실패");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "로컬 로그인 중 오류가 발생했습니다.";
            message.error("로컬 로그인 실패: " + errorMessage);
        } finally {
            setLoadingLocal(false);
        }
    };

    // JWT 로그인 핸들러
    const handleJwtLogin = async () => {
        setLoadingJwt(true);
        try {
            const values = await form.validateFields();
            const { userAccountId, password } = values;

            // `api` 유틸리티 사용 (응답 인터셉터가 토큰을 처리할 수 있도록)
            const response = await api.post(`/account/jwtLogin`, {
                userAccountId,
                password,
            });

            console.log("response.data.token ? " + response.data.token);

            // 백엔드에서 응답 바디에 JWT 토큰을 포함하여 보낸다고 가정
            if (response.data.token) {
                // // localStorage.setItem('accessToken', token);
                // setToken(response.data.token); // 토큰을 localStorage에 저장
                // message.success("JWT 로그인 성공! 메인화면으로 이동합니다.");
                // // setAuth(true);
                // navigate("/home");
                setToken(response.data.token);
                // 인증 상태 반영(필요하면)
                setAuth && setAuth(true);
                message.success("JWT 로그인 성공! 메인화면으로 이동합니다.");
                navigate("/home");
            } else {
                // throw new Error(response.data.message || "JWT 로그인 실패: 토큰이 없습니다.");
                const msg = response.data?.message || 'JWT 로그인 실패: 토큰이 없습니다.';
                message.error(msg);
            }
        } catch (err) {
            
            console.error('handleJwtLogin error:', err); // 반드시 콘솔에 찍어 원인 확인
            if (err?.response && err.response.status === 401) {
                const errorMessage = err.response.data?.message || "로그인 정보가 올바르지 않습니다.";
                message.error(errorMessage);
            } else if (err.message) {
                // 네트워크 에러 등은 err.message에 설명이 있음 (예: "Network Error")
                message.error(`로그인 실패: ${err.message}`);
            } else {
                message.error("로그인 중 알 수 없는 오류가 발생했습니다.");
            }
            // if (err.response && err.response.status === 401) {

            //     // 백엔드에서 보낸 에러 메시지 (예: "아이디 또는 비밀번호가...")를 추출
            //     const errorMessage = err.response.data.message || "로그인 정보가 올바르지 않습니다.";

            //     // alert()를 사용하여 사용자에게 에러 메시지 표시
            //     alert(errorMessage);
            // } else {

            //     alert("로그인 중 알 수 없는 오류가 발생했습니다.");
            // }
        } finally {
            setLoadingJwt(false);
        }
    };

    const goToSignup = () => {
        navigate("/signup");
    };

    const goToFindId = () => {
        navigate("/find-id");
    };

    const goToResetPassword = () => {
        navigate("/reset-password");
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
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {/*
                            <Button
                                type="default"
                                onClick={handleLocalLogin}
                                className="login-form-button"
                                loading={loadingLocal}
                                icon={<LoginOutlined />}
                                size="large"
                                block
                            >
                                로컬 로그인
                            </Button>
                            */}
                            
                            <Button
                                type="primary"
                                onClick={handleJwtLogin}
                                className="login-form-button"
                                loading={loadingJwt}
                                icon={<LoginOutlined />}
                                size="large"
                                block
                            >
                                JWT 로그인
                            </Button>
                        </Space>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                type="link"
                                onClick={goToSignup}
                                className="signup-button"
                                icon={<UserAddOutlined />}
                                block
                            >
                                회원가입
                            </Button>
                            <Button
                                type="link"
                                onClick={goToFindId}
                                className="find-id-button"
                                icon={<SearchOutlined />}
                                block
                            >
                                아이디 찾기
                            </Button>
                            <Button
                                type="link"
                                onClick={goToResetPassword}
                                className="reset-password-button"
                                icon={<ReloadOutlined />}
                                block
                            >
                            비밀번호 재설정
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default Login;