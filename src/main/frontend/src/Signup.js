import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, notification, Space } from "antd"; // notification, Space 추가
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    IdcardOutlined,
    UserAddOutlined,
    LoginOutlined,
    SecurityScanOutlined, // 인증코드 아이콘
} from '@ant-design/icons';
import './Signup.css'; // 기존 CSS 파일 사용

const { Title } = Typography;

const API_BASE_URL = 'http://localhost:8080/api'; // 백엔드 API 주소

function Signup() {
    const [loading, setLoading] = useState(false);
    const [idCheckLoading, setIdCheckLoading] = useState(false);
    const [idAvailable, setIdAvailable] = useState(null); // null: 체크 전, true: 사용 가능, false: 사용 불가
    const [emailSent, setEmailSent] = useState(false); // 이메일 인증코드 발송 여부
    const [emailLoading, setEmailLoading] = useState(false); // 이메일 발송 로딩
    const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증 성공 여부
    const [verifyCodeLoading, setVerifyCodeLoading] = useState(false); // 인증코드 확인 로딩

    const navigate = useNavigate();
    const [form] = Form.useForm();

    // 비밀번호 정규식: 최소 8자, 하나 이상의 특수문자, 영문자, 숫자 포함
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // 아이디 중복 확인
    const handleIdCheck = async () => {
        const userAccountId = form.getFieldValue('userAccountId');
        if (!userAccountId) {
            message.warning('아이디를 입력해주세요.');
            return;
        }
        if (userAccountId.length < 4) {
            message.warning('아이디는 최소 4자 이상이어야 합니다.');
            return;
        }

        setIdCheckLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/account/checkId`, { userAccountId });
            if (response.data.isAvailable) { // 백엔드 응답이 `isAvailable: true` 형태라고 가정
                setIdAvailable(true);
                message.success('사용 가능한 아이디입니다.');
            } else {
                setIdAvailable(false);
                message.error('이미 존재하는 아이디입니다.');
            }
        } catch (err) {
            console.error("ID 중복 확인 실패:", err);
            message.error('아이디 중복 확인 중 오류가 발생했습니다.');
            setIdAvailable(false); // 오류 발생 시 사용 불가로 처리
        } finally {
            setIdCheckLoading(false);
        }
    };

    // 이메일 인증코드 발송
    const sendVerificationCode = async () => {
        const email = form.getFieldValue('email');
        if (!email) {
            message.warning('이메일을 입력해주세요.');
            return;
        }
        setEmailLoading(true);
        try {
            // 백엔드 API 엔드포인트에 맞게 수정해주세요.
            // 예: `/api/email/sendVerificationCode`
            const response = await axios.post(`${API_BASE_URL}/account/sendVerificationCode`, { email });
            if (response.data.isSuccess) { // 백엔드 응답이 `isSuccess: true` 형태라고 가정
                setEmailSent(true);
                message.success('인증코드가 이메일로 발송되었습니다. 메일함을 확인해주세요.');
            } else {
                message.error('인증코드 발송 실패: ' + (response.data.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error("이메일 발송 실패:", err);
            message.error('이메일 발송 중 오류가 발생했습니다.');
        } finally {
            setEmailLoading(false);
        }
    };

    // 이메일 인증코드 확인
    const verifyEmailCode = async () => {
        const email = form.getFieldValue('email');
        const verificationCode = form.getFieldValue('verificationCode');
        if (!email || !verificationCode) {
            message.warning('이메일과 인증코드를 모두 입력해주세요.');
            return;
        }
        setVerifyCodeLoading(true);
        try {
            // 백엔드 API 엔드포인트에 맞게 수정해주세요.
            // 예: `/api/email/verifyCode`
            const response = await axios.post(`${API_BASE_URL}/account/verifyEmailCode`, { email, verificationCode });
            if (response.data.isVerified) { // 백엔드 응답이 `isVerified: true` 형태라고 가정
                setEmailVerified(true);
                message.success('이메일 인증이 완료되었습니다.');
            } else {
                message.error('인증코드 불일치: ' + (response.data.message || '인증코드가 올바르지 않습니다.'));
            }
        } catch (err) {
            console.error("이메일 인증 실패:", err);
            message.error('이메일 인증 중 오류가 발생했습니다.');
            setEmailVerified(false);
        } finally {
            setVerifyCodeLoading(false);
        }
    };

    // 최종 회원가입 로직
    const handleSubmit = async (values) => {
        // 아이디 중복 체크와 이메일 인증이 완료되었는지 다시 확인 (프론트엔드 방어 로직)
        if (idAvailable !== true) {
            message.error('아이디 중복 확인을 완료하고 사용 가능한 아이디를 선택해주세요.');
            return;
        }
        if (emailVerified !== true) {
            message.error('이메일 인증을 완료해주세요.');
            return;
        }

        setLoading(true);
        try {
            const { userAccountId, password, email, username } = values; // 폼에서 가져온 값
            const response = await axios.post(`${API_BASE_URL}/account/register`, { userAccountId, password, email, username });

            if (response.data.isSuccess === true) {
                message.success("회원가입 성공! 로그인 페이지로 이동합니다.");
                navigate("/login");
            } else {
                message.error("회원가입 실패: " + (response.data.message || "알 수 없는 오류가 발생했습니다."));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "회원가입 중 오류가 발생했습니다.";
            message.error("회원가입 실패: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 로그인 페이지로 이동
    const goToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="signup-container">
            <Card className="signup-card">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Title level={2}>회원가입</Title>
                </div>
                <Form
                    form={form}
                    name="signup_form"
                    onFinish={handleSubmit}
                    className="signup-form"
                    layout="vertical"
                >
                    {/* 아이디 입력 필드와 중복 확인 버튼 */}
                    <Form.Item
                        label="아이디"
                        name="userAccountId"
                        hasFeedback // 유효성 검사 피드백 아이콘 표시
                        validateStatus={idAvailable === true ? 'success' : idAvailable === false ? 'error' : ''}
                        rules={[
                            { required: true, message: '아이디를 입력해주세요!' },
                            { min: 4, message: '아이디는 최소 4자 이상이어야 합니다.' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value && idAvailable === false && getFieldValue('userAccountId') === value) {
                                        return Promise.reject(new Error('이미 존재하는 아이디입니다.'));
                                    }
                                    if (value && idAvailable === true && getFieldValue('userAccountId') === value) {
                                        return Promise.resolve();
                                    }
                                    // 사용자가 입력 필드를 다시 수정하면, 중복 확인 상태 초기화
                                    if (idAvailable !== null && form.isFieldTouched('userAccountId') && getFieldValue('userAccountId') !== value) {
                                         setIdAvailable(null);
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="아이디"
                            size="large"
                            suffix={
                                <Button
                                    type="link"
                                    onClick={handleIdCheck}
                                    loading={idCheckLoading}
                                    disabled={idAvailable === true} // 사용 가능하면 버튼 비활성화
                                >
                                    {idAvailable === true ? '확인됨' : '중복확인'}
                                </Button>
                            }
                        />
                    </Form.Item>

                    {/* 비밀번호 입력 필드 */}
                    <Form.Item
                        label="비밀번호"
                        name="password"
                        rules={[
                            { required: true, message: '비밀번호를 입력해주세요!' },
                            { min: 8, message: '비밀번호는 최소 8자 이상이어야 합니다.' },
                            {
                                pattern: passwordRegex,
                                message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="비밀번호"
                            size="large"
                        />
                    </Form.Item>
                    {/* 비밀번호 확인 필드 (선택 사항, 필요하면 추가)
                    <Form.Item
                        label="비밀번호 확인"
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: '비밀번호를 다시 입력해주세요!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('비밀번호가 일치하지 않습니다!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="비밀번호 확인"
                            size="large"
                        />
                    </Form.Item>
                    */}

                    {/* 이메일 입력 필드와 인증 관련 버튼 */}
                    <Form.Item
                        label="이메일"
                        name="email"
                        rules={[
                            { required: true, message: '이메일을 입력해주세요!' },
                            { type: 'email', message: '유효한 이메일 형식이 아닙니다!' },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="이메일"
                            size="large"
                            disabled={emailSent} // 발송 후에는 이메일 변경 불가
                            suffix={
                                <Button
                                    type="link"
                                    onClick={sendVerificationCode}
                                    loading={emailLoading}
                                    disabled={emailSent} // 발송 후에는 버튼 비활성화
                                >
                                    {emailSent ? '재전송' : '인증코드 발송'}
                                </Button>
                            }
                        />
                    </Form.Item>

                    {emailSent && !emailVerified && ( // 인증코드 발송 후 && 인증 전
                        <Form.Item
                            label="인증코드"
                            name="verificationCode"
                            rules={[{ required: true, message: '인증코드를 입력해주세요!' }]}
                        >
                            <Input
                                prefix={<SecurityScanOutlined />}
                                placeholder="인증코드를 입력하세요"
                                size="large"
                                disabled={emailVerified} // 인증 성공 후에는 비활성화
                                suffix={
                                    <Button
                                        type="link"
                                        onClick={verifyEmailCode}
                                        loading={verifyCodeLoading}
                                        disabled={emailVerified} // 인증 성공 후에는 비활성화
                                    >
                                        {emailVerified ? '확인됨' : '확인'}
                                    </Button>
                                }
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="이름"
                        name="username"
                        rules={[{ required: true, message: '이름을 입력해주세요!' }]}
                    >
                        <Input
                            prefix={<IdcardOutlined />}
                            placeholder="이름"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="signup-form-button"
                            loading={loading}
                            icon={<UserAddOutlined />}
                            size="large"
                            block
                        >
                            회원가입
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Button
                            type="link"
                            onClick={goToLogin}
                            className="login-redirect-button"
                            icon={<LoginOutlined />}
                            block
                        >
                            로그인 페이지로 돌아가기
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default Signup;