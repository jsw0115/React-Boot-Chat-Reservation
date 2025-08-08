// src/Home.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from './utils/api'; // axios 대신 api 유틸리티 사용
import { setToken } from './utils/auth'; // setToken 함수 임포트
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

// 모듈화된 컴포넌트 임포트
import DashboardHeader from './components/DashboardHeader';
import ProgressSummary from './components/ProgressSummary';
import TodayTaskList from './components/TodayTaskList';
import ChatWidget from './components/ChatWidget';
import RoutineManagerWidget from './components/RoutineManagerWidget'; // 새로 추가된 루틴 관리 위젯

import axiosInstance from './utils/axiosInstance'; // 새로 만든 인스턴스를 임포트

// CSS 모듈 임포트
import styles from './components/Home.module.css';

function Home() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]); // 오늘의 루틴/일정을 합친 배열
    const [todayTasks, setTodayTasks] = useState([]); // 오늘의 할 일 목록
    const [allRoutines, setAllRoutines] = useState([]); // 전체 루틴 목록
    const [userName, setUserName] = useState("사용자"); // 사용자 이름 (API에서 받아올 수 있음)
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem("token"); // 이걸 추가해야 함

    // // 백엔드 API로부터 오늘 할 일 데이터를 가져오는 함수
    // const fetchDashboardData = async () => {
    //     setIsLoading(true);
    //     try {
    //         // 여러 API를 동시에 호출하여 대시보드 데이터를 구성
    //         const [todaySchedulesResponse, todayRoutinesResponse] = await Promise.all([
    //             axiosInstance.get("/scheduler/list"), // 오늘의 일정 API (백엔드에 구현 필요)
    //             axiosInstance.get("/manage/routine/list"),  // 오늘의 루틴 API (백엔드에 구현 필요)
    //         ]);

    //         // 받아온 데이터를 하나의 task 배열로 통합
    //         const combinedTasks = [
    //             ...todaySchedulesResponse.data.map(item => ({ ...item, type: 'schedule' })),
    //             ...todayRoutinesResponse.data.map(item => ({ ...item, type: 'routine' })),
    //         ];
            
    //         // 시간순으로 정렬
    //         combinedTasks.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            
    //         setTasks(combinedTasks);
    //     } catch (error) {
    //         console.error("대시보드 데이터 로딩 실패:", error);
    //         // alert("데이터를 불러오는 데 실패했습니다.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // 2025.08.03 수정 
    // 데이터 로딩 함수를 useCallback으로 감싸 불필요한 재생성 방지
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Promise.all로 오늘의 할 일과 전체 루틴 목록을 동시에 가져옴
            const [todayResponse, allRoutinesResponse] = await Promise.all([
                axiosInstance.get("/routines/getTodayRoutines", {
                    headers: {Authorization: `Bearer ${token}`},
                    // withCredentials: true // ← 쿠키 기반 인증인 경우 필요
                }), // 오늘의 루틴/일정 API (백엔드 구현 필요)
                axiosInstance.get("/routines/getRoutineDashboard", {
                    headers: {Authorization: `Bearer ${token}`},
                    // withCredentials: true // ← 쿠키 기반 인증인 경우 필요
                }),       // 전체 루틴 목록 API (백엔드 구현 필요)
            ]);

            // 오늘의 할 일 데이터 정렬 및 상태 업데이트
            // const sortedTasks = todayResponse.data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            const taskList = todayResponse.data?.data?.jsonResult ?? [];

            if (!Array.isArray(taskList)) {
                console.warn("jsonResult is not an array:", taskList);
                setTodayTasks([]);
                return;
            }
            const sortedTasks = taskList.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            setAllRoutines(allRoutinesResponse.data);

        } catch (error) {
            console.error("대시보드 데이터 로딩 실패:", error);
            // 401 에러는 인터셉터가 처리하므로 여기서는 일반 에러만 처리
            if (error.response?.status !== 401) {
                message.error("데이터를 불러오는 데 실패했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // useEffect(() => {
    //     // 컴포넌트 마운트 시 데이터 로드
    //     // const token = localStorage.getItem("token"); // 토큰 확인
    //     // if (!token) navigate('/login');
    //     fetchDashboardData();
    // }, []);

    // 2025.08.03 수정 
    useEffect(() => {
        // 컴포넌트 마운트 시 데이터 로드
        // const token = localStorage.getItem("token"); // 토큰 확인
        // if (!token) navigate('/login');
        fetchData();
    }, [fetchData]);

    const handleLogout = async () => {
        try {
            await api.post("/account/logout");
            localStorage.removeItem("token");
            navigate("/login");
        } catch (err) {
            alert("로그아웃 실패: " + (err.response?.data?.message || err.message));
        }
    };

    // 자식 컴포넌트(TodayTaskList)에서 태스크 완료 상태 변경 시 호출될 함수
    const handleToggleComplete = async (taskId, currentStatus) => {
        try {
            // 낙관적 업데이트: 서버 응답을 기다리지 않고 UI를 먼저 변경
            // setTasks(tasks.map(task => 
            //     task.id === taskId ? { ...task, isCompleted: !currentStatus } : task
            // ));
            
            // 서버에 변경사항 전송
            //await axios.patch(`/api/tasks/${taskId}/toggle`); // 통합된 완료 처리 API (백엔드에 구현 필요)
            
            // 2025.08.03 수정 
            setTodayTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, isCompleted: !currentStatus } : task
                )
            );

            try {
                await api.patch(`/routines/toggleTaskComplete`); // 통합된 완료 처리 API
            } catch (error) {
                message.error("상태 변경에 실패했습니다.");
                // 롤백
                setTodayTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === taskId ? { ...task, isCompleted: currentStatus } : task
                    )
                );
            }

        } catch (error) {
            console.error("태스크 상태 변경 실패:", error);
            // 업데이트 실패 시 UI 롤백
            setTasks(tasks.map(task => 
                task.id === taskId ? { ...task, isCompleted: currentStatus } : task
            ));
            alert("상태 변경에 실패했습니다.");
        }
    };
    
    return (
        <div className={styles.dashboardContainer}>
            <DashboardHeader 
                userName={userName}
                onLogout={handleLogout}
                onNavigate={navigate}
            />

            <div className={styles.widgetsGrid}>
                {/* 위젯 1: 진행률 요약 */}
                {/* 
                <ProgressSummary tasks={tasks} />
                */}

                {/* 위젯 2: 오늘 할 일 목록 */}
                {/* 
                <TodayTaskList 
                    tasks={tasks}
                    isLoading={isLoading}
                    onToggleComplete={handleToggleComplete}
                />
                 */}

                {/* 위젯 1: 진행률 요약 */}
                <ProgressSummary tasks={todayTasks} />

                {/* 위젯 2: 오늘 할 일 목록 */}
                <TodayTaskList 
                    tasks={todayTasks}
                    isLoading={isLoading}
                    onToggleComplete={handleToggleComplete}
                />
                
                {/* 위젯 3: 전체 루틴 관리 */}
                {/*
                */}
                <RoutineManagerWidget 
                    routines={allRoutines}
                    isLoading={isLoading}
                    onRefresh={fetchData} // 루틴 변경 후 데이터 새로고침을 위한 콜백
                />
                
                {/* 위젯 3: 채팅 */}
                <ChatWidget />
            </div>
        </div>
    );
}

export default Home;