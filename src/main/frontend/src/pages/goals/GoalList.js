// src/pages/goals/GoalList.js
import React, { useState, useEffect, useCallback } from 'react';
import { Button, List, Card, Typography, message, Space, Popconfirm, Tag, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import GoalModal from './GoalModal'; // 같은 폴더 내 GoalModal
import api from '../../utils/api'; // 경로 변경: ../../utils/api
import '../../styles/GoalList.css'; // 경로 변경: ../../styles/GoalList.css

const { Title, Text } = Typography;

function GoalList() {
    const [goals, setGoals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const fetchGoals = useCallback(async () => {
        try {
            const response = await api.get('/goals');
            setGoals(response.data);
        } catch (error) {
            console.error('목표 로드 실패:', error);
            message.error('목표를 불러오는데 실패했습니다.');
        }
    }, []);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const handleAddGoal = () => {
        setSelectedGoal(null);
        setIsModalOpen(true);
    };

    const handleEditGoal = (goal) => {
        setSelectedGoal(goal);
        setIsModalOpen(true);
    };

    const handleGoalSave = async (goalData) => {
        try {
            if (goalData.id) {
                await api.put(`/goals/${goalData.id}`, goalData);
                message.success('목표가 성공적으로 수정되었습니다.');
            } else {
                await api.post('/goals', goalData);
                message.success('목표가 성공적으로 추가되었습니다.');
            }
            fetchGoals();
            setIsModalOpen(false);
        } catch (error) {
            console.error('목표 저장/수정 실패:', error);
            message.error('목표 저장/수정 중 오류가 발생했습니다.');
        }
    };

    const handleGoalDelete = async (goalId) => {
        try {
            await api.delete(`/goals/${goalId}`);
            message.success('목표가 성공적으로 삭제되었습니다.');
            fetchGoals();
        } catch (error) {
            console.error('목표 삭제 실패:', error);
            message.error('목표 삭제에 실패했습니다.');
        }
    };

    const calculateProgress = (currentAmount, targetAmount) => {
        if (targetAmount === 0) return 0;
        return Math.min(100, (currentAmount / targetAmount) * 100);
    };

    return (
        <div className="goal-list-container">
            <Card className="goal-list-card">
                <div className="goal-list-header">
                    <Title level={2} style={{ margin: 0 }}><TrophyOutlined /> 나의 목표</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddGoal}>
                        새 목표 추가
                    </Button>
                </div>
                <List
                    itemLayout="horizontal"
                    dataSource={goals}
                    locale={{ emptyText: '아직 등록된 목표가 없습니다.' }}
                    renderItem={goal => (
                        <List.Item
                            actions={[
                                <Button
                                    type="link"
                                    icon={<EditOutlined />}
                                    onClick={() => handleEditGoal(goal)}
                                >
                                    수정
                                </Button>,
                                <Popconfirm
                                    title="정말로 이 목표를 삭제하시겠습니까?"
                                    onConfirm={() => handleGoalDelete(goal.id)}
                                    okText="예"
                                    cancelText="아니오"
                                >
                                    <Button
                                        type="link"
                                        danger
                                        icon={<DeleteOutlined />}
                                    >
                                        삭제
                                    </Button>
                                </Popconfirm>,
                            ]}
                        >
                            <List.Item.Meta
                                title={<Text strong>{goal.title}</Text>}
                                description={
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text type="secondary">{goal.description}</Text>
                                        <Text>목표 금액: {goal.targetAmount?.toLocaleString()}원</Text>
                                        <Text>현재 달성: {goal.currentAmount?.toLocaleString()}원</Text>
                                        <Progress
                                            percent={calculateProgress(goal.currentAmount, goal.targetAmount)}
                                            status={calculateProgress(goal.currentAmount, goal.targetAmount) >= 100 ? "success" : "active"}
                                        />
                                        <Tag color={goal.completed ? "green" : "blue"}>
                                            {goal.completed ? "달성 완료" : "진행 중"}
                                        </Tag>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>

            <GoalModal
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                goalInfo={selectedGoal}
                onSave={handleGoalSave}
            />
        </div>
    );
}

export default GoalList;