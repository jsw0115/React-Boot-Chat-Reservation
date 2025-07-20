import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, LockOutlined, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api'; // api 유틸리티 사용
import './ResetPassword.css'; // 필요하다면 별도 CSS 파일 생성

const { Title } = Typography;

function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 새 비밀번호 입력
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { token } = useParams(); // URL 파라미터에서 토큰 가져오기 (예: /reset-password/abc123def456)

    // 비밀번호 정규식: 최소 8자, 하나 이상의 특수문자, 영문자, 숫자 포함
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    useEffect(() => {
        if (token) {
            setStep(2); // URL에 토큰이 있으면 2단계 (새 비밀번호 설정)로 진입
            // 필요하다면 여기서 토큰 유효성 초기 검증 API 호출 가능
        }
    }, [token]);

    // 1단계: 비밀번호 재설정 이메일 요청
    const onRequestResetEmail = async (values) => {
        setLoading(true);
        try {
            const response = await api.post('/account/forgotPassword', { email: values.email });
            if (response.data.isSuccess) {
                message.success('비밀번호 재설정 링크가 이메일로 발송되었습니다. 메일함을 확인해주세요.');
                // 성공 시에도 다음 단계로 넘어가지 않고, 사용자에게 이메일 확인을 유도
            } else {
                message.error(response.data.message || '비밀번호 재설정 이메일 발송에 실패했습니다.');
            }
        } catch (error) {
            console.error('재설정 이메일 요청 오류:', error);
            message.error('이메일 발송 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // 2단계: 새 비밀번호 설정
    const onResetPassword = async (values) => {
        setLoading(true);
        try {
            if (!token) {
                message.error('유효한 재설정 토큰이 없습니다.');
                setLoading(false);
                return;
            }

            const response = await api.post('/account/resetPassword', {
                token: token,
                newPassword: values.newPassword,
            });

            if (response.data.isSuccess) {
                message.success('비밀번호가 성공적으로 재설정되었습니다. 로그인 해주세요.');
                navigate('/login'); // 로그인 페이지로 이동
            } else {
                message.error(response.data.message || '비밀번호 재설정에 실패했습니다. 토큰이 만료되었거나 유효하지 않을 수 있습니다.');
            }
        } catch (error) {
            console.error('비밀번호 재설정 오류:', error);
            message.error('비밀번호 재설정 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <Card className="reset-password-card">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Title level={2}>비밀번호 재설정</Title>
                </div>
                {step === 1 && (
                    <Form
                        form={form}
                        name="forgot_password_form"
                        onFinish={onRequestResetEmail}
                        layout="vertical"
                    >
                        <Form.Item
                            label="이메일 주소"
                            name="email"
                            rules={[
                                { required: true, message: '이메일 주소를 입력해주세요!' },
                                { type: 'email', message: '유효한 이메일 형식이 아닙니다!' },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="가입 시 사용한 이메일" size="large" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<MailOutlined />}
                                size="large"
                                block
                            >
                                재설정 링크 발송
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button
                                type="link"
                                onClick={() => navigate('/login')}
                                icon={<ArrowLeftOutlined />}
                                block
                            >
                                로그인 페이지로 돌아가기
                            </Button>
                        </div>
                    </Form>
                )}
                {step === 2 && (
                    <Form
                        form={form}
                        name="reset_password_form"
                        onFinish={onResetPassword}
                        layout="vertical"
                    >
                        <Form.Item
                            label="새 비밀번호"
                            name="newPassword"
                            rules={[
                                { required: true, message: '새 비밀번호를 입력해주세요!' },
                                { min: 8, message: '비밀번호는 최소 8자 이상이어야 합니다.' },
                                {
                                    pattern: passwordRegex,
                                    message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
                                },
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="새 비밀번호" size="large" />
                        </Form.Item>
                        <Form.Item
                            label="새 비밀번호 확인"
                            name="confirmNewPassword"
                            dependencies={['newPassword']}
                            hasFeedback
                            rules={[
                                { required: true, message: '새 비밀번호를 다시 입력해주세요!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('두 비밀번호가 일치하지 않습니다!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="새 비밀번호 확인" size="large" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<ReloadOutlined />}
                                size="large"
                                block
                            >
                                비밀번호 재설정
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button
                                type="link"
                                onClick={() => navigate('/login')}
                                icon={<ArrowLeftOutlined />}
                                block
                            >
                                로그인 페이지로 돌아가기
                            </Button>
                        </div>
                    </Form>
                )}
            </Card>
        </div>
    );
}

export default ResetPassword;