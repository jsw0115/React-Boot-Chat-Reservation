// src/pages/goals/GoalModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, InputNumber, Checkbox, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const GoalModal = ({ visible, onCancel, goalInfo, onSave }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            if (goalInfo) {
                form.setFieldsValue({
                    title: goalInfo.title,
                    description: goalInfo.description,
                    targetAmount: goalInfo.targetAmount,
                    currentAmount: goalInfo.currentAmount,
                    completed: goalInfo.completed,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    currentAmount: 0,
                    completed: false,
                });
            }
        }
    }, [visible, goalInfo, form]);

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            const newGoal = {
                id: goalInfo ? goalInfo.id : null,
                title: values.title,
                description: values.description,
                targetAmount: values.targetAmount,
                currentAmount: values.currentAmount || 0,
                completed: values.completed || false,
            };
            await onSave(newGoal);
        } catch (error) {
            console.error("목표 저장 실패:", error);
            message.error('목표 저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={visible}
            title={goalInfo ? "목표 수정" : "새 목표 추가"}
            onCancel={onCancel}
            footer={null}
            centered
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        name="title"
                        label="목표 제목"
                        rules={[{ required: true, message: '목표 제목을 입력해주세요!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="상세 설명"
                    >
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="targetAmount"
                        label="목표 금액 (원)"
                        rules={[{ required: true, message: '목표 금액을 입력해주세요!' }]}
                    >
                        <InputNumber
                            min={0}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="currentAmount"
                        label="현재 달성 금액 (원)"
                        rules={[{ required: true, message: '현재 달성 금액을 입력해주세요!' }]}
                    >
                        <InputNumber
                            min={0}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="completed"
                        valuePropName="checked"
                    >
                        <Checkbox>목표 달성 완료</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={goalInfo ? <EditOutlined /> : <PlusOutlined />}>
                            {goalInfo ? "수정" : "추가"}
                        </Button>
                        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                            취소
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default GoalModal;