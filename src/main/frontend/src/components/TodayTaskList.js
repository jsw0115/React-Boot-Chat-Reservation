import React from 'react';
import styles from './Home.module.css';
import taskStyles from './TodayTaskList.module.css'; // 전용 CSS

function TodayTaskList({ tasks, isLoading, onToggleComplete }) {
    
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    return (
        <div className={styles.widget}>
            <h2>오늘의 할 일</h2>
            <div className={taskStyles.taskList}>
                {isLoading ? (
                    <p>로딩 중...</p>
                ) : tasks.length === 0 ? (
                    <p>오늘 예정된 할 일이 없습니다.</p>
                ) : (
                    tasks.map(task => (
                        <div key={`${task.type}-${task.id}`} className={`${taskStyles.taskItem} ${task.isCompleted ? taskStyles.completed : ''}`}>
                            <input 
                                type="checkbox" 
                                checked={task.isCompleted} 
                                onChange={() => onToggleComplete(task.id, task.isCompleted)}
                                className={taskStyles.checkbox}
                            />
                            <div className={taskStyles.taskInfo}>
                                <span className={taskStyles.taskTime}>{formatTime(task.startTime)}</span>
                                <span className={taskStyles.taskTitle}>{task.title}</span>
                            </div>
                            <span className={`${taskStyles.taskType} ${task.type === 'routine' ? taskStyles.routine : taskStyles.schedule}`}>
                                {task.type === 'routine' ? '루틴' : '일정'}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TodayTaskList;