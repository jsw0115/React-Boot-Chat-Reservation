// src/pages/goals/RoutineModal.js
import React, { useState, useEffect, memo } from 'react';
import { Modal, Form, Input, Button, TimePicker, Checkbox, Select, DatePicker, message, Spin, Space, InputNumber, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import './RoutineModal.css';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

// repeatType에 대한 상수 관리
const REPEAT_TYPES = {
    DAILY: 1,
    WEEKLY: 2,
    MONTHLY: 3,
    YEARLY: 4, // '매년' 추가
    INTERVAL: 5, // 'n일 마다' 추가
};

// Task 타입 
const TASK_TYPES = { 
    CHECK: 1, 
    COUNT: 2, 
    TIMER: 3 
};

// 카테고리 데이터 (실제로는 API로 받아오는 것을 권장)
const categoryOptions = [
    { value: 'HEALTH', label: '💪 건강' },
    { value: 'STUDY', label: '📚 공부' },
    { value: 'SELF_DEV', label: '🌱 자기계발' },
    { value: 'HOBBY', label: '🎨 취미' },
];

const RoutineModal = ({ visible, onCancel, routineInfo, onSave }) => {
    
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 현재 선택된 repeatType을 state로 관리하여 UI를 동적으로 변경
    const [repeatType, setRepeatType] = useState(REPEAT_TYPES.DAILY);

    useEffect(() => {

        // Modal이 띄워질 때 
        if (visible) {
            
            if (routineInfo) {
                
                // 루틴 수정 
                form.setFieldValue({
                    ...routineInfo,
                    startTime: routineInfo.startTime ? dayjs(routineInfo.startTime, 'HH:mm:ss') : null,
                    endTime: routineInfo.endTime ? dayjs(routineInfo.endTime, 'HH:mm:ss') : null,
                    dateRange: (routineInfo.startDt && routineInfo.endDt) ? [dayjs(routineInfo.startDt), dayjs(routineInfo.endDt)] : null,
                });
                setRepeatType(routineInfo.repeatType || REPEAT_TYPES.DAILY);
            } else {
                // 루틴 생성 
                // 생성 모드
                form.resetFields();
                form.setFieldsValue({
                    repeatType: REPEAT_TYPES.DAILY,
                    tasks: [{ taskType: TASK_TYPES.CHECK }], // 기본 Task 1개
                });
                // 'repeatType'의 기본값을 매일(1)로 설정
                form.setFieldValue('repeatType', REPEAT_TYPES.DAILY);
                setRepeatType(REPEAT_TYPES.DAILY);
            }
        }
    }, [visible, routineInfo, form]);

    // Form 제출 
    const handleFormSubmit = async () => {

        setLoading(true);
        try {
            const values = await form.validateFields();
            const requestDto  = {
                ...values,
                id : routineInfo ? routineInfo.id : null,
                title : values.title,
                category: values.category,
                memo : values.memo,
                // DatePicker 값을 Timestamp 형식의 문자열로 변환
                startTimeStr: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
                endTimeStr: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,

                startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
                endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
                
                // 반복 기간 설정
                startDtStr: values.startTime ? values.dateRange[0].format('YYYY-MM-DD HH:mm:ss') : null,
                endDtStr: values.endTime ? values.dateRange[1].format('YYYY-MM-DD HH:mm:ss') : null,
                
                repeatType: values.repeatType,
                repeatInterval: values.repeatType === REPEAT_TYPES.INTERVAL ? values.repeatInterval : 1,
                repeatDays: values.repeatDays || [],

                // 개선된 TaskDto 구조에 맞게 tasks 데이터 변환
                tasks: values.tasks ? values.tasks.map(task => ({
                    content: task.content,
                    taskType: task.taskType || TASK_TYPES.CHECK,
                    goalCount: task.taskType === TASK_TYPES.COUNT ? task.goalCount : 0,
                    timerInSeconds: task.taskType === TASK_TYPES.TIMER ? task.timerInSeconds : 0,
                })) : [],
            };
            delete requestDto.dateRange;
            await onSave(requestDto);
            onCancel();
        } catch (e) {
            console.error("루틴을 저장 도중 오류 발생", e);
            message.error("루틴을 저장하는 도중 오류가 발생하였습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            open={visible}
            title={routineInfo ? "루틴 수정" : "루틴 생성"}
            onCancel={onCancel}
            onOk={() => form.submit()}
            footer={[
                /*
                currentEvent && 
                ( // 수정 모드일 때만 삭제 버튼 표시
                <Popconfirm
                    key="delete-event-popconfirm" 
                    title="정말 이 일정을 삭제하시겠습니까?"
                    onConfirm={() => handleDeleteEvent(currentEvent.id)}
                    okText="삭제"
                    cancelText="취소"
                >
                    <Button type="danger">삭제</Button>
                </Popconfirm>
                ),
                */
                <Button key="back" onClick={() => {
                    //setIsModalVisible(false);
                    setIsModalOpen(false);
                    form.resetFields();
                }}>
                    취소
                </Button>,
                <Button key="submit" type="primary" onClick={handleFormSubmit}>
                    {routineInfo ? "수정" : "추가"}
                </Button>,
            ]}
            okText={routineInfo ? "수정" : "저장"}
            cancelText="취소"
            width={600}
            centered
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={handleFormSubmit}
                >
                    {/* 2단 레이아웃 적용 */}
                    <Row gutter={24}>
                        <Col span={12}>
                            {/* 루틴 제목 */}
                            <Form.Item name="title" label="루틴 제목" rules={[{ required: true, message: '루틴 제목을 입력해주세요.' }]}>
                                <Input placeholder="예: 아침 명상하기" style={{width: '250px'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/* 루틴 설명 */}
                            <Form.Item name="category" label="카테고리">
                                <Select placeholder="카테고리를 선택하세요" options={categoryOptions}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* 루틴 설명 */}
                    <Form.Item name="memo" label="메모">
                        <TextArea rows={2} placeholder="루틴에 대한 간단한 설명을 적어보세요." />
                    </Form.Item>

                    {/* ③ 시작/종료 시간을 날짜+시간 선택 가능하도록 DatePicker로 변경 */}
                    <Row gutter={24}>
                        {/* 루틴 시작 시간 */}
                        <Form.Item name="startTime" label="시작 시간">
                            {/*<TimePicker format="HH:mm" />*/}
                            <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                        </Form.Item>
                        {/* 루틴 종료 시간 */}
                        <Form.Item name="endTime" label="종료 시간">
                            {/*<TimePicker format="HH:mm" />*/}
                            <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                        </Form.Item>
                    </Row>

                    {/* 루틴 반복 설정 */}
                    <Form.Item label="반복 설정">
                        <Space.Compact block>
                            <Form.Item name="repeatType" noStyle>
                                <Select style={{ width: '40%' }} onChange={(value) => setRepeatType(value)}>
                                    <Option value={REPEAT_TYPES.DAILY}>매일</Option>
                                    <Option value={REPEAT_TYPES.WEEKLY}>매주</Option>
                                    <Option value={REPEAT_TYPES.MONTHLY}>매월</Option>
                                    <Option value={REPEAT_TYPES.YEARLY}>매년</Option>
                                    <Option value={REPEAT_TYPES.INTERVAL}>N일 마다</Option>
                                </Select>
                            </Form.Item>
                            {/* 'n일 마다' 선택 시에만 간격 입력 필드를 보여줌 */}
                            {repeatType === REPEAT_TYPES.INTERVAL && (
                                <Form.Item name="repeatInterval" noStyle rules={[{ required: true, message: '간격을 입력하세요'}]}>
                                    <InputNumber min={2} addonAfter="일 마다" style={{ width: '60%' }} placeholder="2 이상의 숫자"/>
                                </Form.Item>
                            )}
                        </Space.Compact>
                    </Form.Item>

                    {/* '매주' 선택 시에만 요일 선택 필드를 보여줌 */}
                    {repeatType === REPEAT_TYPES.WEEKLY && (
                        <Form.Item name="repeatDays" label="반복 요일">
                            <Checkbox.Group options={weekDays.map(day => ({ label: day, value: day }))} />
                        </Form.Item>
                    )}
                    
                    <Form.Item name="dateRange" label="반복 기간">
                        <DatePicker.RangePicker />
                    </Form.Item>

                    {/* ④ 개선된 TaskDto를 위한 상세 활동 UI */}
                    <h4>상세 활동 (Tasks)</h4>
                    <Form.List name="tasks">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item {...restField} name={[name, 'content']} rules={[{ required: true, message: '활동 내용을 입력하세요' }]}>
                                            <Input placeholder="상세 활동 내용" style={{width: 250}}/>
                                        </Form.Item>

                                        <Form.Item {...restField} name={[name, 'taskType']} initialValue={TASK_TYPES.CHECK}>
                                            <Select style={{width: 120}}>
                                                <Option value={TASK_TYPES.CHECK}>체크</Option>
                                                <Option value={TASK_TYPES.COUNT}>횟수 기록</Option>
                                                <Option value={TASK_TYPES.TIMER}>타이머</Option>
                                            </Select>
                                        </Form.Item>

                                        {/* Task 유형에 따라 추가 입력 필드 동적 렌더링 */}
                                        <Form.Item shouldUpdate noStyle>
                                            {() => {
                                                const taskType = form.getFieldValue(['tasks', name, 'taskType']);
                                                if (taskType === TASK_TYPES.COUNT) {
                                                    return <Form.Item {...restField} name={[name, 'goalCount']}><InputNumber min={1} addonAfter="회"/></Form.Item>;
                                                }
                                                if (taskType === TASK_TYPES.TIMER) {
                                                    return <Form.Item {...restField} name={[name, 'timerInSeconds']}><InputNumber min={1} addonAfter="초"/></Form.Item>;
                                                }
                                                return null;
                                            }}
                                        </Form.Item>

                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        활동 추가
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Spin>
        </Modal>
    );
};

export default RoutineModal;