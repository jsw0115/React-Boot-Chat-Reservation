import React from 'react';
import styles from './Home.module.css'; // 같은 스타일 시트 공유

function DashboardHeader({ userName, onLogout, onNavigate }) {
    return (
        <header className={styles.header}>
            <h1>{userName}님, 안녕하세요!</h1>
            <nav className={styles.navButtons}>
                <button onClick={() => onNavigate("/manage-routine")}>루틴 관리</button>
                <button onClick={() => onNavigate("/scheduler")}>전체 일정</button>
                <button onClick={onLogout}>로그아웃</button>
            </nav>
        </header>
    );
}

export default DashboardHeader;