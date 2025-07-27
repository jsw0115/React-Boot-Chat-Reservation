import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    IdcardOutlined,
    UserAddOutlined,
    LoginOutlined,
    SecurityScanOutlined,
} from '@ant-design/icons';
import api from '../../utils/api';
import './Signup.css';

const { Title } = Typography;

function Signup() {
    const [loading, setLoading] = useState(false);
    const [idCheckLoading, setIdCheckLoading] = useState(false);
    const [idAvailable, setIdAvailable] = useState(null); // null: 체크 전, true: 사용 가능, false: 사용 불가
    const [emailSent, setEmailSent] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verifyCodeLoading, setVerifyCodeLoading] = useState(false);

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // useCallback으로 불필요한 함수 재생성 방지
    const handleIdCheck = useCallback(async () => {
        const userAccountId = form.getFieldValue('userAccountId');
        if (!userAccountId || userAccountId.length < 4) {
            message.warning('아이디는 최소 4자 이상이어야 합니다.');
            return;
        }

        setIdCheckLoading(true);
        try {
            const response = await api.post(`/account/checkId`, { userAccountId });
            console.log("response ? " + response);
            console.log("response.data.data.isSuccess ? " + response.data.data.isSuccess);
            console.log("response.data.data.jsonResult ? " + response.data.data.jsonResult);
            if (response.data.data.isSuccess && response.data.data.jsonResult) {
                setIdAvailable(true);
                message.success('사용 가능한 아이디입니다.');
            } else {
                setIdAvailable(false);
                form.validateFields(['userAccountId']); // 중복 시 antd 폼에 에러 상태 반영
                message.error(response.data.message || '이미 존재하는 아이디입니다.');
            }
        } catch (err) {
            message.error('아이디 중복 확인 중 오류가 발생했습니다.');
            setIdAvailable(false);
        } finally {
            setIdCheckLoading(false);
        }
    }, [form]);

    const sendVerificationCode = useCallback(async () => {
        const email = form.getFieldValue('email');
        if (!email) {
            message.warning('이메일을 입력해주세요.');
            return;
        }
        setEmailLoading(true);
        try {
            const response = await api.post(`/account/sendVerificationCode`, { email });
            if (response.data.isSuccess) {
                setEmailSent(true);
                message.success('인증코드가 이메일로 발송되었습니다. 메일함을 확인해주세요.');
            } else {
                message.error('인증코드 발송 실패: ' + (response.data.message || '알 수 없는 오류'));
            }
        } catch (err) {
            message.error('이메일 발송 중 오류가 발생했습니다.');
        } finally {
            setEmailLoading(false);
        }
    }, [form]);

    const verifyEmailCode = useCallback(async () => {
        const email = form.getFieldValue('email');
        const verificationCode = form.getFieldValue('verificationCode');
        if (!verificationCode) {
            message.warning('인증코드를 입력해주세요.');
            return;
        }
        setVerifyCodeLoading(true);
        try {
            const response = await api.post(`/account/verifyEmailCode`, { email, verificationCode });
            if (response.data.isSuccess && response.data.data.isVerified) {
                setEmailVerified(true);
                message.success('이메일 인증이 완료되었습니다.');
            } else {
                message.error('인증코드가 올바르지 않습니다.');
            }
        } catch (err) {
            message.error('이메일 인증 중 오류가 발생했습니다.');
        } finally {
            setVerifyCodeLoading(false);
        }
    }, [form]);

    const handleSubmit = async (values) => {
        if (idAvailable !== true) { //  || emailVerified !== true
            message.error('아이디 중복 확인과 이메일 인증을 모두 완료해야 합니다.');
            return;
        }

        setLoading(true);
        try {
            const { userAccountId, password, email, username } = values;
            const response = await api.post(`/account/register`, { userAccountId, password, email, username });
            if (response.data.isSuccess === true) {
                message.success("회원가입 성공! 로그인 페이지로 이동합니다.");
                navigate("/login");
            } else {
                message.error("회원가입 실패: " + (response.data.message || "알 수 없는 오류"));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
            message.error("회원가입 실패: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 폼 필드 값이 변경될 때마다 호출되는 함수
    const handleValuesChange = (changedValues) => {
        // 'userAccountId' 필드가 변경되면, 아이디 중복 확인 상태를 초기화
        if (changedValues.hasOwnProperty('userAccountId')) {
            setIdAvailable(null);
        }
        // 'email' 필드가 변경되면, 이메일 인증 관련 상태를 모두 초기화
        if (changedValues.hasOwnProperty('email')) {
            setEmailSent(false);
            setEmailVerified(false);
        }
    };

    return (
        <div className="signup-container">
            <Card className="signup-card">
                <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>회원가입</Title>
                <Form
                    form={form}
                    name="signup_form"
                    onFinish={handleSubmit}
                    onValuesChange={handleValuesChange} // 폼 값 변경 감지
                    className="signup-form"
                    layout="vertical"
                >
                    <Form.Item
                        label="아이디"
                        name="userAccountId"
                        hasFeedback
                        validateStatus={idAvailable === true ? 'success' : idAvailable === false ? 'error' : ''}
                        help={idAvailable === false ? '이미 사용 중인 아이디입니다.' : ''}
                        rules={[{ required: true, message: '아이디를 입력해주세요!' }, { min: 4, message: '아이디는 최소 4자 이상이어야 합니다.' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="아이디 (4자 이상)"
                            size="large"
                            addonAfter={ // suffix 대신 addonAfter 사용
                                <Button
                                    type="primary"
                                    onClick={handleIdCheck}
                                    loading={idCheckLoading}
                                    disabled={idAvailable === true}
                                >
                                    중복확인
                                </Button>
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="비밀번호"
                        name="password"
                        rules={[{ required: true, message: '비밀번호를 입력해주세요!' }, { pattern: passwordRegex, message: '영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="비밀번호 확인"
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[{ required: true, message: '비밀번호를 다시 입력해주세요!' }, ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) return Promise.resolve();
                                return Promise.reject(new Error('비밀번호가 일치하지 않습니다!'));
                            },
                        })]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="비밀번호 확인" size="large" />
                    </Form.Item>
                    {
                    /* 이메일 인증코드 발송 부분 주석 처리 */
                    /*
                    <Form.Item label="이메일" name="email" rules={[{ required: true, message: '이메일을 입력해주세요!' }, { type: 'email', message: '유효한 이메일 형식이 아닙니다!' }]}>
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="이메일"
                            size="large"
                            disabled={emailVerified}
                            addonAfter={
                                <Button
                                    type="primary"
                                    onClick={sendVerificationCode}
                                    loading={emailLoading}
                                    disabled={emailSent || emailVerified}
                                >
                                    {emailSent ? '재전송' : '인증코드 발송'}
                                </Button>
                            }
                        />
                    </Form.Item>
                    */}
{
                    /* 이메일 인증코드 발송 부분 주석 처리 */
                    /*
                    {emailSent && !emailVerified && (
                        <Form.Item label="인증코드" name="verificationCode" rules={[{ required: true, message: '인증코드를 입력해주세요!' }]}>
                            <Input
                                prefix={<SecurityScanOutlined />}
                                placeholder="인증코드를 입력하세요"
                                size="large"
                                addonAfter={
                                    <Button
                                        type="primary"
                                        onClick={verifyEmailCode}
                                        loading={verifyCodeLoading}
                                    >
                                        인증 확인
                                    </Button>
                                }
                            />
                        </Form.Item>
                    )}
                    */}

                    <Form.Item label="이름" name="username" rules={[{ required: true, message: '이름을 입력해주세요!' }]}>
                        <Input prefix={<IdcardOutlined />} placeholder="이름" size="large" />
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
                            disabled={idAvailable !== true}
                        >
                            회원가입
                        </Button>
                    </Form.Item>

                    {/*|| emailVerified !== true*/}

                    <Button type="link" onClick={() => navigate("/login")} icon={<LoginOutlined />} block>
                        로그인 페이지로 돌아가기
                    </Button>
                </Form>
            </Card>
        </div>
    );
}

export default Signup;