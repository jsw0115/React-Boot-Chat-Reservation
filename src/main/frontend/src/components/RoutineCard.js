// src/components/RoutineCard.js
import React from 'react';
import { Card, Checkbox, Progress, Typography } from 'antd';

const { Title, Text } = Typography;

const RoutineCard = ({ routine, onTaskToggle }) => {
    const { title, tasks, completedTaskCount, totalTaskCount } = routine;
    const progress = totalTaskCount > 0 ? Math.round((completedTaskCount / totalTaskCount) * 100) : 0;

    return (
        <Card title={<Title level={4}>{title}</Title>}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Progress percent={progress} style={{ flexGrow: 1, marginRight: '1rem' }} />
                <Text>{`${completedTaskCount} / ${totalTaskCount}`}</Text>
            </div>
            {tasks.map(task => (
                <div key={task.id} style={{ marginBottom: '0.5rem' }}>
                    <Checkbox onChange={() => onTaskToggle(task.id)}>
                        {task.content}
                    </Checkbox>
                </div>
            ))}
        </Card>
    );
};

export default RoutineCard;