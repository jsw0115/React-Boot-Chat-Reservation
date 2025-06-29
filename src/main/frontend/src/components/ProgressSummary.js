import React from 'react';
import styles from './Home.module.css';

function ProgressSummary({ tasks }) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className={styles.widget}>
            <h2>오늘의 진행률</h2>
            <div style={{ textAlign: 'center' }}>
                {/* 간단한 텍스트 요약 */}
                <p style={{ fontSize: '1.2rem' }}>
                    총 <strong>{totalTasks}개</strong>의 할 일 중 <strong>{completedTasks}개</strong>를 완료했어요!
                </p>
                {/* 프로그레스 바 */}
                <div style={{ background: '#e9ecef', borderRadius: '10px', overflow: 'hidden', height: '25px', marginTop: '1rem' }}>
                    <div style={{ width: `${progress}%`, background: '#28a745', height: '100%', transition: 'width 0.5s ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        {progress}%
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProgressSummary;