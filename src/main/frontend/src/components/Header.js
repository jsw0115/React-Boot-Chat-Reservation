// src/components/Header.js
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { CalendarOutlined, TrophyOutlined, LogoutOutlined, MessageOutlined, HomeOutlined } from '@ant-design/icons'; // HomeOutlined, MessageOutlined 추가
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { removeToken } from '../utils/auth'; // 경로 수정: ../utils/auth

const { Header: AntHeader } = Layout;

function Header({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        removeToken();
        setIsAuthenticated(false);
        navigate('/login');
    };

    const getSelectedKeys = () => {
        if (location.pathname.startsWith('/dashboard')) {
            return ['dashboard'];
        }
        if (location.pathname.startsWith('/scheduler')) {
            return ['scheduler'];
        }
        if (location.pathname.startsWith('/goals')) {
            return ['goals'];
        }
        if (location.pathname.startsWith('/chat')) {
            return ['chat'];
        }
        return [];
    };

    return (
        <AntHeader style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
            <div className="logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>My App</div>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={getSelectedKeys()}
                style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
            >
                <Menu.Item key="dashboard" icon={<HomeOutlined />}>
                    <Link to="/dashboard">홈</Link>
                </Menu.Item>
                <Menu.Item key="scheduler" icon={<CalendarOutlined />}>
                    <Link to="/scheduler">캘린더</Link>
                </Menu.Item>
                <Menu.Item key="goals" icon={<TrophyOutlined />}>
                    <Link to="/goals">목표</Link>
                </Menu.Item>
                {/* 채팅방 메뉴는 모달을 띄우는 기능이므로 Link 대신 onClick 사용 */}
                {/* Home.js에서 채팅방 목록을 띄우므로, Header에서는 채팅방 링크를 제거하거나 Home으로 연결 */}
                {/* <Menu.Item key="chat" icon={<MessageOutlined />}>
                    <Link to="/dashboard">채팅</Link>
                </Menu.Item> */}
            </Menu>
            <Button
                type="text"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ color: 'white', marginLeft: '20px' }}
            >
                로그아웃
            </Button>
        </AntHeader>
    );
}

export default Header;