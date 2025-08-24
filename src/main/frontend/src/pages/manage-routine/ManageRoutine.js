import React, { useEffect,useState,useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, List, Card, Typography, message, Space, Popconfirm, Tag, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
import RoutineModal from './RoutineModal'; // 같은 폴더 내 GoalModal
import axiosInstance from './../../utils/axiosInstance'; // 새로 만든 인스턴스를 임포트

const token = localStorage.getItem("token"); // 이걸 추가해야 함

const ManageRoutine = () => {

    const [routines, setRoutines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [editingRoutine, setEditingRoutine] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 루틴 정보 가져오는 function
    const ManageRoutineData = useCallback(async () => {

        setIsLoading(true);
        try {

            // ManageRoutineData
            const ManageRoutineResponse = await Promise.all([
                axiosInstance.get("/routines/getRoutines", {
                    headers: {Authorization: `Bearer ${token}`},
                    // withCredentials: true // ← 쿠키 기반 인증인 경우 필요
                })
            ]);

            const manageRoutineList = ManageRoutineResponse.data?.data?.jsonResult ?? [];
            setRoutines(manageRoutineList);
        } catch (e) {

            console.error("루틴 관리 데이터 로딩 실패:", e);
            if (e.response?.status !== 401) {
                message.error("데이터를 불러오는 데 실패했습니다.");
            }
        } finally {

        }
    }, []);

    // 루틴 목록
    useEffect(() => {
        ManageRoutineData();
    }, [ManageRoutineData]);

    // 루틴 등록
    const handleAddRoutine = () => {
        setIsModalOpen(true);
        setEditingRoutine(null);
    };

    // 루틴 수정
    const handleEditRoutine = (routine) => {
        setIsModalOpen(true);
        setEditingRoutine(routine);
    };

    // 취소 버튼 
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 루틴 저장
    const handleRoutineSave = async (routineData) => {
        try {
            if (routineData.id) {
                await axiosInstance.put(`/routines/updateRoutine/${routineData.id}`, routineData, {
                    headers: {Authorization: `Bearer ${token}`},
                    // withCredentials: true // ← 쿠키 기반 인증인 경우 필요
                });
                message.success("루틴 수정에 성공하였습니다.");
            } else {
                await axiosInstance.post(`/routines/createRoutine`, routineData, {
                    headers: {Authorization: `Bearer ${token}`},
                    // withCredentials: true // ← 쿠키 기반 인증인 경우 필요
                });
                message.success("루틴 저장에 성공하였습니다.");
            }
            setIsModalVisible(false);
            ManageRoutineData();
            return Promise.resolve();
        } catch (e) {
            console.error('루틴 저장 실패 : ' + e);
            message.error("루틴 저장에 실패하였습니다.");
        }
    };

    // 삭제 
    const handleDeleteEvent = async (scheduleId) => {
        try {

            await axiosInstance.delete(`/routines/deleteRoutine/${routineId}`,
                {
                    headers: {Authorization: `Bearer ${token}`},
                    withCredentials: true // ← 쿠키 기반 인증인 경우 필요
                }
            );

            message.success('루틴이 삭제되었습니다.');
            
            setIsModalOpen(false); // visible -> open
            ManageRoutineData();
            //fetchEvents();            // 최신 데이터 다시 불러오기
        } catch (e) {
            console.error('일정 삭제 실패:', e);
            if (error.response) {
                message.error(`삭제 실패: ${e.response.data.message || e.message}`);
            } else {
                message.error('일정 삭제 중 네트워크 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div>
            {/*<Card className="goal-list-card">*/}
                <div>
                    <Title level={2} style={{ margin: 0 }}><TrophyOutlined /> 루틴목록 페이지</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRoutine}>
                        새 루틴 등록
                    </Button>
                </div>
                <List
                    bordered
                    itemLayout="horizontal"
                    dataSource={routines}
                    locale={{ emptyText: '아직 등록된 목표가 없습니다.' }}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button icon={<EditOutlined/>} onClick={() => {handleEditRoutine(item)}} >
                                    수정
                                </Button>,
                                <Popconfirm
                                    title="정말 이 루틴을 삭제하시겠습니까?"
                                    onConfirm={() => handleDeleteEvent(item.id)}
                                    okText="삭제"
                                    cancelText="취소"
                                >
                                    <Button icon={<DeleteOutlined />} danger>삭제</Button>
                                </Popconfirm>
                            ]}
                            >
                            ${item.title}
                        </List.Item>
                    )}
                />
            {/*</Card>*/}

            <RoutineModal
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                routineInfo={selectedRoutine}
                onSave={handleRoutineSave}
            />

        </div>
    );
};

export default ManageRoutine;   // export default로 컴포넌트 내보내기