// src/api/socket.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectStomp = (roomId, onMessageCallback) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('🟢 WebSocket 연결됨');

      // 메시지 수신 구독
      stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
        const body = JSON.parse(message.body);
        onMessageCallback(body); // 콜백 실행
      });
    },
    onStompError: (frame) => {
      console.error('STOMP ERROR:', frame.headers['message']);
      console.error('상세:', frame.body);
      alert(frame.body || '채팅 서버 오류가 발생했습니다.');
    },
    onWebSocketError: (event) => {
      console.error('WebSocket error:', event);
    },
    debug: str => console.log("[STOMP DEBUG]", str),
  });

  stompClient.activate();
};

// 메시지 보내기 함수
export const sendChatMessage = (roomId, content) => {
  if (!stompClient || !stompClient.connected) return;

  // 서버 DTO와 맞추기: { roomId, content }
  const message = {
    roomId: roomId,
    content: content,
  };

  stompClient.publish({
    destination: `/pub/chat.sendMessage`,
    body: JSON.stringify(message),
  });
};

// 연결 해제
export const disconnectStomp = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
