import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, IdcardOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // api 유틸리티 사용
import './FindId.css'; // 필요하다면 별도 CSS 파일 생성

const { Title } = Typography;

function FindId() {
    const [loading, setLoading] = useState(false);
    const [foundAccountId, setFoundAccountId] = useState(null); // 찾은 아이디 표시
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // 백엔드 API 엔드포인트에 맞게 수정
            const response = await api.post('/account/findId', {
                email: values.email,
                username: values.username // 백엔드 DTO 필드명에 맞게 조정
            });

            if (response.data.isSuccess && response.data.data && response.data.data.userAccountId) {
                setFoundAccountId(response.data.data.userAccountId);
                message.success('아이디를 찾았습니다! 아래에서 확인해주세요.');
            } else {
                message.error(response.data.message || '입력하신 정보와 일치하는 아이디를 찾을 수 없습니다.');
                setFoundAccountId(null);
            }
        } catch (error) {
            console.error('아이디 찾기 오류:', error);
            message.error('아이디 찾기 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
            setFoundAccountId(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="find-id-container">
            <Card className="find-id-card">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Title level={2}>아이디 찾기</Title>
                </div>
                <Form
                    name="find_id_form"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="이름"
                        name="username"
                        rules={[{ required: true, message: '이름을 입력해주세요!' }]}
                    >
                        <Input prefix={<IdcardOutlined />} placeholder="가입 시 입력한 이름" size="large" />
                    </Form.Item>
                    <Form.Item
                        label="이메일"
                        name="email"
                        rules={[
                            { required: true, message: '이메일을 입력해주세요!' },
                            { type: 'email', message: '유효한 이메일 형식이 아닙니다!' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="가입 시 입력한 이메일" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<SearchOutlined />}
                            size="large"
                            block
                        >
                            아이디 찾기
                        </Button>
                    </Form.Item>

                    {foundAccountId && (
                        <div style={{ marginTop: '20px', textAlign: 'center', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                찾으시는 아이디: <span style={{ color: '#1890ff' }}>{foundAccountId}</span>
                            </p>
                        </div>
                    )}

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
            </Card>
        </div>
    );
}

export default FindId;