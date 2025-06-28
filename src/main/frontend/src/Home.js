// src/Home.js 또는 src/components/Home.js

//import React from "react";
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 hook
import ChatList from "./pages/chat/ChatList";
const token = localStorage.getItem("token"); // 이걸 추가해야 함

function Home() {
  
  const navigate = useNavigate(); // 컴포넌트 내부에서 호출
  const [chatRooms, setChatRooms] = useState([]);
  const [showChatList, setShowChatList] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

    // ManageRoutine : 루틴 관리
    const ManageRoutine = async (e) => {

        e.preventDefault();
        try {

          // 1. 백엔드에서 루틴 데이터를 요청 (선택사항: 이 데이터로 상태 설정 가능)
          //const response = await axios.get("http://localhost:8080/api/manageRoutine/index");

          // 2. 성공 시 페이지 이동
          navigate("/manage-routine"); // 미리 라우터에 등록된 경로로 이동
        } catch (err) {
            alert("루틴 관리 불러오기 실패: " + (err.response?.data || err.message));
        }
    }

  // 
  const Logout = async (e) => {
    
    e.preventDefault();
    try {

      // 로그아웃 로직에서 http://localhost:8080 이부분 적지 않아도 되도록 만들기
      const response = await axios.post("http://localhost:8080/api/account/logout");
      if (response.data.isSuccess === true) {

        localStorage.removeItem("token"); // 예시
        // 로그인 페이지로 이동
        navigate("/login");
      } else {

        alert(response.data.message);
      }
    } catch (err) {
      alert("로그아웃 실패: " + err.response.data);
    }

  }

  // ChatList
  const ChatList = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:8080/api/chat/rooms");
      setChatRooms(response.data); // 받아온 채팅방 목록 저장
      setShowChatList(true); // 목록 표시
    } catch (err) {
      alert("채팅방 목록 불러오기 실패: " + (err.response?.data || err.message));
    }
  }

  // 채팅방 생성
  const createRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) {
      alert("채팅방 이름을 입력하세요.");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/chat/createRoom", { name: newRoomName });
      setNewRoomName("");
      await ChatList(e); // 생성 후 목록 새로고침
    } catch (err) {
      alert("채팅방 생성 실패: " + (err.response?.data || err.message));
    }
  };

    // 채팅방 상세 페이지
  const enterChatRoom = (roomId) => {
    navigate(`/chat/${roomId}`); // 채팅방 상세 페이지로 이동
  };

  // 일정 페이지 이동
  const MyCalendar = async (e) => {
    e.preventDefault();
    try {

        // 성공 시 페이지 이동
        navigate("/scheduler"); // 미리 라우터에 등록된 경로로 이동
    } catch (err) {
        alert("루틴 관리 불러오기 실패: " + (err.response?.data || err.message));
    }
  };
  
  return (
    <div style={{ padding: "2rem" }}>
      <h1>홈페이지</h1>
      <p>로그인에 성공하셨습니다! 🎉</p>
      <p>여기에 원하는 내용을 자유롭게 추가하세요.</p>
      <button onClick={ManageRoutine}>루틴관리</button>
      <button onClick={Logout}>로그아웃</button>
      <button onClick={ChatList}>채팅방</button>
      <button onClick={MyCalendar}>일정</button>

      {/* 채팅방 생성 폼 */}
      <form onSubmit={createRoom} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="새 채팅방 이름"
          value={newRoomName}
          onChange={e => setNewRoomName(e.target.value)}
        />
        <button type="submit">채팅방 생성</button>
      </form>


      {showChatList && (
        <div>
          <h2>채팅방 목록</h2>
          <ul>
            {chatRooms.map(room => (
              <li key={room.id}>
                {room.name}
                <button onClick={() => enterChatRoom(room.id)}>입장</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;