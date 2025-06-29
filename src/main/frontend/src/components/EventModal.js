// src/components/EventModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, Checkbox, Select, message, Spin } from 'antd'; // TimePicker 제거 (RangePicker에 포함)
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const EventModal = ({
    visible,
    onCancel,
    eventInfo,
    onSave,
    onDelete
}) => {
    const [form] = Form.useForm();
    const [isAllDay, setIsAllDay] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            if (eventInfo) {
                form.setFieldsValue({
                    title: eventInfo.title,
                    description: eventInfo.extendedProps.description,
                    color: eventInfo.backgroundColor,
                    range: [moment(eventInfo.start), moment(eventInfo.end)],
                    allDay: eventInfo.allDay,
                });
                setIsAllDay(eventInfo.allDay);
            } else {
                form.resetFields();
                setIsAllDay(false);
                const now = moment();
                form.setFieldsValue({
                    range: [now, now.clone().add(1, 'hour')],
                    color: '#3788d8',
                });
            }
        }
    }, [visible, eventInfo, form]);

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            const newEvent = {
                id: eventInfo ? eventInfo.id : null,
                title: values.title,
                description: values.description,
                start: values.range[0].toISOString(),
                end: values.range[1].toISOString(),
                allDay: values.allDay,
                color: values.color,
            };
            await onSave(newEvent);
            onCancel();
        } catch (error) {
            console.error("이벤트 저장 실패:", error);
            message.error('일정 저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete(eventInfo.id);
            onCancel();
        } catch (error) {
            console.error("이벤트 삭제 실패:", error);
            message.error('일정 삭제에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={visible}
            title={eventInfo ? "일정 수정/삭제" : "새 일정 추가"}
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
                        label="제목"
                        rules={[{ required: true, message: '제목을 입력해주세요!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="설명"
                    >
                        <TextArea rows={2} />
                    </Form.Item>

                    <Form.Item
                        name="range"
                        label="기간"
                        rules={[{ required: true, message: '기간을 선택해주세요!' }]}
                    >
                        <RangePicker
                            showTime={!isAllDay ? { format: 'HH:mm' } : false}
                            format={isAllDay ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="allDay"
                        valuePropName="checked"
                    >
                        <Checkbox checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)}>하루 종일</Checkbox>
                    </Form.Item>

                    <Form.Item
                        name="color"
                        label="색상"
                        rules={[{ required: true, message: '색상을 선택해주세요!' }]}
                    >
                        <Select>
                            <Option value="#3788d8">파란색</Option>
                            <Option value="#28a745">초록색</Option>
                            <Option value="#dc3545">빨간색</Option>
                            <Option value="#ffc107">노란색</Option>
                            <Option value="#6f42c1">보라색</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: eventInfo ? 'space-between' : 'flex-end' }}>
                            {eventInfo && (
                                <Button
                                    type="danger"
                                    icon={<DeleteOutlined />}
                                    onClick={handleDelete}
                                    style={{ marginRight: 8 }}
                                >
                                    삭제
                                </Button>
                            )}
                            <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
                                {eventInfo ? "수정" : "추가"}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default EventModal;