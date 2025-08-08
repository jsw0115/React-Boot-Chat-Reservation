// src/components/RoutineModal.js
import React from 'react';
import { Modal, Form, Input, Button, Checkbox, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const weekDays = ['월', '화', '수', '목', '금'];
const weekend = ['토', '일'];

const RoutineModal = ({ visible, onCancel, onSave, initialValues }) => {
    const [form] = Form.useForm();

    /*
    // 모달이 열릴 때 초기값 세팅
    React.useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                tasks: Array.isArray(initialValues?.tasks) ? initialValues.tasks : [],
                ...initialValues
            });
        } else {
            form.resetFields();     // 새 루틴일 때에는 빈 폼
        }
    }, [visible, initialValues, form]);
    */

    const handleSave = () => {
        form.validateFields()
            .then(values => {
                form.resetFields();
                onSave(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleAfterOpenChange = (opened) => {
        if (opened) {
            // 모달이 완전히 열린 후에 폼 초기화
            if (initialValues) {
                form.setFieldsValue({
                    tasks: Array.isArray(initialValues?.tasks) ? initialValues.tasks : [],
                    ...initialValues
                });
            } else {
                form.resetFields();  // ⬅️ 이 타이밍이면 경고 없음
            }
        }
    };

    return (
        <Modal
            open={visible} // AntD v5
            title="새 루틴 만들기"
            okText="저장"
            cancelText="취소"
            onCancel={onCancel}
            onOk={handleSave}
            afterOpenChange={handleAfterOpenChange} // ✅ 이 부분 추가
        >
            <Form
                form={form}
                layout="vertical"
                name="routine_form"
            >
                {/*
                initialValues={{
                    tasks: [],
                    ...initialValues
                }}*/}
                <Form.Item
                    name="title"
                    label="루틴 이름"
                    rules={[{ required: true, message: '루틴 이름을 입력하세요!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="repeatDays"
                    label="반복 요일"
                    rules={[{ required: true, message: '반복 요일을 선택하세요!' }]}
                >
                    <Checkbox.Group>
                        <Checkbox value="매일">매일</Checkbox>
                        <Checkbox value="주중">주중</Checkbox>
                        <Checkbox value="주말">주말</Checkbox>
                        {weekDays.map(day => <Checkbox key={day} value={day}>{day}</Checkbox>)}
                        {weekend.map(day => <Checkbox key={day} value={day}>{day}</Checkbox>)}
                    </Checkbox.Group>
                </Form.Item>

                <Form.List name="tasks">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                    key={key}
                                    style={{ display: 'flex', marginBottom: 8 }}
                                    align="baseline"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'content']}
                                        rules={[{ required: true, message: '활동 내용을 입력하세요' }]}
                                    >
                                        <Input placeholder="상세 활동 (예: 물 마시기)" />
                                    </Form.Item>
                                    <DeleteOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    상세 활동 추가
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default RoutineModal;