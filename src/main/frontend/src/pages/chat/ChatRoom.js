import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState, useRef } from "react";

function ChatRoom() {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        const stompClient = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 5000,
            connectHeaders: {
            Authorization: "Bearer ", //+ yourTokenHere, // ✅ 토큰을 여기에!
            },
            onConnect: () => {
                console.log("🟢 WebSocket 연결됨");

            if (!mounted) {
                return;
            }
            setConnected(true);

            // 메시지 구독
            stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
                const msgBody = JSON.parse(message.body);
                if (mounted) {
                    setMessages((prev) => [...prev, msgBody]);
                }
            });

            // 사용자 입장 메시지 서버로 전송
            stompClient.publish({
                destination: "/pub/chat.addUser",
                body: JSON.stringify({
                    chatRoom: { id: roomId },
                    type: "JOIN"
                }),
            });
        },
        onDisconnect: () => {
            console.log("🔌 WebSocket 연결 종료");
            setConnected(false);
        },
        onStompError: (frame) => {
            console.error("❌ STOMP 에러:", frame.headers["message"]);
            console.error("📄 상세:", frame.body);
        },
        onWebSocketError: (event) => {
            console.error("🌐 WebSocket 에러:", event);
        },
        });

        clientRef.current = stompClient;
        stompClient.activate();

        return () => {
          mounted = false;
          stompClient.deactivate();
        };
    }, [roomId]);

  const sendMessage = () => {
    if (
      clientRef.current &&
      clientRef.current.connected &&
      input.trim()
    ) {
      clientRef.current.publish({
        destination: "/pub/chat.sendMessage", // ✅ pub 경로 주의
        body: JSON.stringify({
          chatRoom: { id: roomId },
          type: "CHAT",
          content: input
        }),
      });
      setInput("");
    } else {
      alert("❗ WebSocket 연결이 아직 완료되지 않았습니다.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>채팅방: {roomId}</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: 300,
          overflowY: "auto",
          marginBottom: 16,
          padding: "0.5rem"
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="메시지 입력"
        style={{ width: "70%" }}
        disabled={!connected}
      />
      <button onClick={sendMessage} disabled={!connected}>
        전송
      </button>
    </div>
  );
}

export default ChatRoom;
