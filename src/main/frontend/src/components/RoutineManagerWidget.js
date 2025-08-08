import React, { useState } from 'react';
import { Button, List, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../utils/api';
import RoutineModal from './RoutineModal'; // 루틴 생성/수정 모달 재활용
import styles from './Home.module.css';

const RoutineManagerWidget = ({ routines, isLoading, onRefresh }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState(null); // 수정할 루틴 데이터

    // 새 루틴 추가 모달 열기
    const handleAddNew = () => {
        setEditingRoutine(null); // 수정 모드가 아님을 명시
        setIsModalVisible(true);
    };

    // 기존 루틴 수정 모달 열기
    const handleEdit = (routine) => {
        setEditingRoutine(routine);
        setIsModalVisible(true);
    };

    // 루틴 삭제 처리
    const handleDelete = async (routineId) => {
        try {
            await api.delete(`/routines/${routineId}`); // 루틴 삭제 API
            message.success('루틴이 삭제되었습니다.');
            onRefresh(); // 부모 컴포넌트에 데이터 새로고침 요청
        } catch (error) {
            message.error('루틴 삭제에 실패했습니다.');
        }
    };

    // 모달에서 저장 버튼 클릭 시 (생성 또는 수정)
    const handleSaveRoutine = async (values) => {
        try {
            if (editingRoutine) {
                // 수정 모드
                await api.put(`/routines/${editingRoutine.id}`, values); // 루틴 수정 API
                message.success('루틴이 수정되었습니다.');
            } else {
                // 생성 모드
                await api.post('/routines', values); // 루틴 생성 API
                message.success('루틴이 생성되었습니다.');
            }
            setIsModalVisible(false);
            onRefresh(); // 데이터 새로고침
        } catch (error) {
            message.error('루틴 저장에 실패했습니다.');
        }
    };

    return (
        <div className={styles.widget}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>전체 루틴 관리</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                    새 루틴
                </Button>
            </div>
            <List
                itemLayout="horizontal"
                dataSource={Array.isArray(routines) ? routines : []}
                loading={isLoading}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(item)} />,
                            <Popconfirm
                                title="정말로 이 루틴을 삭제하시겠습니까?"
                                onConfirm={() => handleDelete(item.id)}
                                okText="삭제"
                                cancelText="취소"
                            >
                                <Button type="text" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                        ]}
                    >
                        {/*description={`반복: ${item.repeatDays.join(', ')}`}*/}
                        <List.Item.Meta
                            title={item.title}
                            
                        />
                    </List.Item>
                )}
            />
            {isModalVisible && (
                <RoutineModal
                    visible={isModalVisible}
                    /*open={isModalVisible}*/
                    onCancel={() => setIsModalVisible(false)}
                    onSave={handleSaveRoutine}
                    initialValues={editingRoutine} // 수정할 데이터를 모달에 전달
                    /*
                    initialValues={{
                        tasks: [],
                        ...(initialValues || {})
                    }} // 수정할 데이터를 모달에 전달
                    */
                />
            )}
        </div>
    );
};

export default RoutineManagerWidget;