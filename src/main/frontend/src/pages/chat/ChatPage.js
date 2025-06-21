// src/pages/ChatPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatPage() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleEnter = () => {
    if (roomId.trim()) {
      navigate(`/chat/${roomId}`);
    } else {
      alert("채팅방 ID를 입력하세요.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🔒 로그인한 유저만 입장 가능한 채팅방</h2>
      <input
        style={styles.input}
        type="text"
        placeholder="채팅방 ID 입력 (예: room1)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button style={styles.button} onClick={handleEnter}>
        채팅방 입장
      </button>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '100px',
    textAlign: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '250px',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default ChatPage;
