// src/pages/ChatList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChatList() {
    const navigate = useNavigate();

    const chatRooms = [
        { id: 'room1', name: '💬 자유 채팅방' },
        { id: 'room2', name: '📢 공지 채널' },
        { id: 'room3', name: '👩‍💻 개발자 토론방' },
    ];

    const enterRoom = (roomId) => {
        navigate(`/chat/${roomId}`);
    };

    return (
        <div style={styles.container}>
            <h2>채팅방 목록</h2>
            <ul style={styles.list}>
            {chatRooms.map((room) => (
                <li
                    key={room.id}
                    style={styles.item}
                    onClick={() => enterRoom(room.id)}
                >
                    {room.name}
                </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: { padding: '50px', textAlign: 'center' },
    list: { listStyle: 'none', padding: 0 },
    item: {
        padding: '15px',
        margin: '10px auto',
        width: '300px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#f9f9f9',
        transition: 'all 0.2s ease-in-out',
    },
};

export default ChatList;
