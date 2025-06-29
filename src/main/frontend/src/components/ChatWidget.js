// src/components/ChatWidget.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import chatStyles from './ChatWidget.module.css';

function ChatWidget() {
    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState([]);
    const [isRoomListVisible, setIsRoomListVisible] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");

    const fetchChatRooms = async () => {
        try {
            const response = await axios.get("/api/chat/rooms");
            setChatRooms(response.data);
            setIsRoomListVisible(true);
        } catch (err) {
            alert("채팅방 목록 불러오기 실패: " + (err.response?.data?.message || err.message));
        }
    };
    
    const createRoom = async (e) => {
        e.preventDefault();
        if (!newRoomName.trim()) return;
        try {
            await axios.post("/api/chat/createRoom", { name: newRoomName });
            setNewRoomName("");
            fetchChatRooms(); // 생성 후 목록 새로고침
        } catch (err) {
            alert("채팅방 생성 실패: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className={styles.widget}>
            <h2>채팅</h2>
            <form onSubmit={createRoom} className={chatStyles.form}>
                <input
                    type="text"
                    placeholder="새 채팅방 이름"
                    value={newRoomName}
                    onChange={e => setNewRoomName(e.target.value)}
                    className={chatStyles.input}
                />
                <button type="submit" className={chatStyles.button}>생성</button>
            </form>
            <button onClick={fetchChatRooms} className={chatStyles.fullButton}>
                채팅방 목록 보기
            </button>
            {isRoomListVisible && (
                <ul className={chatStyles.roomList}>
                    {chatRooms.map(room => (
                        <li key={room.id} onClick={() => navigate(`/chat/${room.id}`)}>
                            {room.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ChatWidget;