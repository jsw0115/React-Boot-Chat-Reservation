import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import momentPlugin from '@fullcalendar/moment';
import moment from 'moment';
import 'moment/locale/ko';
import './custom-calendar.css'; // 커스텀 CSS 파일 임포트
import { Modal, Button, Form, Input, DatePicker, Select, Tag, Popconfirm, message } from 'antd'; // message 추가
import { CalendarOutlined, PushpinOutlined, TeamOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Popover, Checkbox } from 'antd';
import axios from 'axios'; // axios 임포트

// Moment.js 한국어 설정
moment.locale('ko');

const { RangePicker } = DatePicker;
const { Option } = Select;

// API 기본 URL 설정 (백엔드 서버 주소로 변경하세요!)
const API_BASE_URL = 'http://localhost:8080/api'; // 예시: 스프링 부트 백엔드 API 주소

// 카테고리별 색상 및 아이콘 매핑
const categoryMap = {
  '업무': { color: '#6a1b9a', icon: <CalendarOutlined /> }, // 진한 보라색 (FullCalendar 버튼 색상과 유사)
  '개인': { color: '#43a047', icon: <PushpinOutlined /> }, // 자연스러운 초록색
  '회의': { color: '#ef6c00', icon: <TeamOutlined /> },   // 주황색
  '기타': { color: '#c62828', icon: <QuestionCircleOutlined /> }, // 어두운 빨간색
};

const token = localStorage.getItem("token"); // 이걸 추가해야 함

// 중요도별 색상 매핑
const importanceMap = {
  '긴급': { tagColor: 'red', borderColor: '#d32f2f', textColor: 'white' }, // 더 진한 빨강
  '중요': { tagColor: 'gold', borderColor: '#fbc02d', textColor: 'black' }, // 노랑 (텍스트는 검정으로 대비)
  '일반': { tagColor: 'green', borderColor: '#689f38', textColor: 'white' }, // 더 진한 초록
};

function MyCalendar() {
  const [events, setEvents] = useState([]); // 이벤트 목록
  //const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 여부
  const [isModalOpen, setIsModalOpen] = useState(false); // visible -> open 으로 이름 변경
  const [currentEvent, setCurrentEvent] = useState(null); // 수정할 이벤트 (FullCalendar Event 객체)
  const [form] = Form.useForm(); // Ant Design 폼
  const [goals, setGoals] = useState([]); // { id, text, date, isCompleted }
  const [filterCategory, setFilterCategory] = useState('all'); // 필터링할 카테고리

  // // Popover 관련 상태 추가
  // const [popoverVisible, setPopoverVisible] = useState(false);
  // const [popoverEvent, setPopoverEvent] = useState(null); // Popover에 표시할 이벤트 정보
  // Popover 관련 상태 추가
  const [popoverOpen, setPopoverOpen] = useState(false); // popoverVisible -> popoverOpen 으로 이름 변경
  const [popoverEvent, setPopoverEvent] = useState(null);


  // --- 1. 초기 데이터 로드 (컴포넌트 마운트 시) ---
  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/scheduler`, 
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true // ← 쿠키 기반 인증인 경우 필요
        }
      );
      
      console.log(response.data);
      
      // 백엔드에서 받은 데이터를 FullCalendar 형식으로 변환
      const formattedEvents = response.data.map(event => ({
        id: event.id, // 백엔드에서 생성된 ID 사용
        title: event.title,
        start: new Date(event.startTime).toISOString(), // 백엔드 필드명에 맞게 수정 (ISO String이어야 함)
        end: new Date(event.endTime).toISOString(),     // 백엔드 필드명에 맞게 수정 (ISO String이어야 함)
        allDay: event.allDay,   // 백엔드 필드명에 맞게 수정
        extendedProps: {
          category: event.category,
          importance: event.importance,
          // 기타 필요한 필드 추가 (예: description, location 등)
        },
        // FullCalendar의 시각적 속성을 백엔드 데이터 기반으로 설정
        backgroundColor: importanceMap[event.importance]?.borderColor || categoryMap[event.category]?.color,
        borderColor: importanceMap[event.importance]?.borderColor || categoryMap[event.category]?.color,
        textColor: importanceMap[event.importance]?.textColor || 'white',
      }));

      console.log("변환된 이벤트:", formattedEvents);

      setEvents(formattedEvents);
      message.success('일정 데이터를 성공적으로 불러왔습니다.');
    } catch (error) {
      console.error('일정 불러오기 실패:', error);
      message.error('일정 데이터를 불러오는 데 실패했습니다. 서버 연결을 확인하세요.');
    }
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]); // fetchEvents가 변경될 때 (최초 렌더링 시) 실행

  // --- 2. 일정 추가/수정 모달 열기 ---
  const showEventModal = (info = null) => {
    setCurrentEvent(info ? info.event : null); // info.event는 FullCalendar Event 객체
    if (info && info.event) {
      // 수정 모드: 기존 이벤트 정보로 폼 채우기
      form.setFieldsValue({
        title: info.event.title,
        dateRange: [moment(info.event.start), moment(info.event.end)],
        category: info.event.extendedProps.category,
        importance: info.event.extendedProps.importance,
      });
    } else {
      // 추가 모드: 폼 초기화 및 기본값 설정 (필요시)
      form.resetFields();
      // 날짜 클릭 시 해당 날짜로 DatePicker의 기본값 설정
      if (info && info.dateStr) {
        form.setFieldsValue({
          dateRange: [moment(info.dateStr), moment(info.dateStr).add(1, 'hour')]
        });
      } else {
        // 새 일정 추가 버튼 클릭 시 현재 시간으로 기본값 설정
        form.setFieldsValue({
          dateRange: [moment(), moment().add(1, 'hour')]
        });
      }
      form.setFieldsValue({ importance: '일반', category: '업무' }); // 새 일정 추가 시 기본 중요도/카테고리
    }
    // setIsModalVisible(true);
    setPopoverOpen(false); // 모달이 열릴 때 Popover는 닫기
    setIsModalOpen(true); // visible -> open
  };

  // --- 3. 일정 저장 (추가/수정) API 호출 ---
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { title, dateRange, category, importance } = values;

      const eventDataToSend = {
        title,
        startTime: dateRange[0].toISOString(), // ISO String 형식으로 백엔드에 전송
        endTime: dateRange[1].toISOString(),
        category,
        importance,
        allDay: dateRange[0].isSame(dateRange[1], 'day') && dateRange[0].hour() === 0 && dateRange[1].hour() === 0, // 종일 여부 판단
        // 필요한 다른 필드 추가 (예: description, location 등)
      };

      if (currentEvent) {
        // --- 3-1. 일정 수정 (PUT API) ---
        const scheduleId = currentEvent.id; // 수정할 이벤트의 ID
        await axios.put(
          `${API_BASE_URL}/scheduler/${scheduleId}`, 
          eventDataToSend, 
          {
            headers: {Authorization: `Bearer ${token}`},
            withCredentials: true // ← 쿠키 기반 인증인 경우 필요
          }
        );
        message.success('일정이 성공적으로 수정되었습니다.');
      } else {
        // --- 3-2. 일정 추가 (POST API) ---
        await axios.post(
          `${API_BASE_URL}/scheduler`, 
          eventDataToSend, 
          {
            headers: {Authorization: `Bearer ${token}`},
            withCredentials: true // ← 쿠키 기반 인증인 경우 필요
          }
        );
        message.success('새 일정이 성공적으로 추가되었습니다.');
      }

      //setIsModalVisible(false); // 모달 닫기
      setIsModalOpen(false); // visible -> open
      form.resetFields();       // 폼 초기화
      fetchEvents();            // 최신 데이터 다시 불러오기
    } catch (error) {
      console.error('일정 저장/수정 실패:', error);
      if (error.response) {
        message.error(`작업 실패: ${error.response.data.message || error.message}`);
      } else {
        message.error('일정 저장/수정 중 네트워크 오류가 발생했습니다.');
      }
    }
  };

  // // 이벤트 클릭 (수정 모달 열기)
  // const handleEventClick = (info) => {
  //   showEventModal(info);
  // };

  // --- Popover를 위한 이벤트 클릭 핸들러 (Modal 대신 Popover를 먼저 띄움) ---
  const handleEventClick = useCallback((info) => {
    setPopoverEvent(info.event); // Popover에 표시할 이벤트 정보 설정
    setPopoverOpen(true);
    // setPopoverVisible(true); // Popover 표시
    // 모달은 여기서 바로 띄우지 않습니다.
  }, []);

  // Popover가 닫힐 때 호출될 함수
  const handlePopoverClose = () => {
    //setPopoverVisible(false);
    setPopoverOpen(false);
    setPopoverEvent(null);
  };

  // --- 4. 일정 삭제 API 호출 ---
  const handleDeleteEvent = async (scheduleId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/scheduler/${scheduleId}`, 
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true // ← 쿠키 기반 인증인 경우 필요
        }
      );
      message.success('일정이 성공적으로 삭제되었습니다.');
      //setIsModalVisible(false); // 모달 닫기
      setIsModalOpen(false); // visible -> open
      fetchEvents();            // 최신 데이터 다시 불러오기
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      if (error.response) {
        message.error(`삭제 실패: ${error.response.data.message || error.message}`);
      } else {
        message.error('일정 삭제 중 네트워크 오류가 발생했습니다.');
      }
    }
  };

  // --- 5. 드래그앤드롭/리사이즈 API 호출 ---
  const handleEventUpdateOnDropOrResize = async (info) => {
    try {
      const scheduleId = info.event.id;
      const updatedEventData = {
        title: info.event.title,
        startTime: info.event.startStr,
        endTime: info.event.endStr || info.oldEvent.endStr, // end가 없는 경우 대비 (리사이즈 안 한 경우)
        category: info.event.extendedProps.category,
        importance: info.event.extendedProps.importance,
        allDay: info.event.allDay,
      };
      await axios.put(
        `${API_BASE_URL}/scheduler/${scheduleId}`, 
        updatedEventData, 
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true // ← 쿠키 기반 인증인 경우 필요
        }
      );
      message.success('일정 시간이 성공적으로 변경되었습니다.');
      // fetchEvents()를 호출하여 최신 상태를 유지하거나,
      // 직접 events 상태를 업데이트하여 불필요한 API 호출을 줄일 수 있습니다.
      // 여기서는 간결성을 위해 fetchEvents를 다시 호출합니다.
      fetchEvents();
    } catch (error) {
      console.error('일정 시간 변경 실패:', error);
      info.revert(); // API 호출 실패 시 UI 변경 되돌리기
      if (error.response) {
        message.error(`시간 변경 실패: ${error.response.data.message || error.message}`);
      } else {
        message.error('일정 시간 변경 중 네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleEventDrop = useCallback((info) => {
    handleEventUpdateOnDropOrResize(info);
  }, [handleEventUpdateOnDropOrResize]);

  const handleEventResize = useCallback((info) => {
    handleEventUpdateOnDropOrResize(info);
  }, [handleEventUpdateOnDropOrResize]);


  // 필터링된 이벤트 반환
  const getFilteredEvents = () => {
    //if (filterCategory === 'all') {
      //return events;
    //}
    return events;
    //return events.filter(event => event.extendedProps.category === filterCategory);
  };

  // 이벤트 팝오버 내용 컴포넌트
  const EventPopoverContent = ({ event, onEdit, onDelete }) => {
    const { title, start, end, extendedProps } = event;
    const { category, importance } = extendedProps;
    const { color, icon } = categoryMap[category] || { color: '#d9d9d9', icon: <QuestionCircleOutlined /> };
    const { tagColor: importanceTagColor } = importanceMap[importance] || { tagColor: 'default' };

    return (
      <div>
        <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag color={color} icon={icon}>{category}</Tag>
          <Tag color={importanceTagColor}>{importance}</Tag>
          {title}
        </h4>
        <p>
          <CalendarOutlined style={{ marginRight: '5px' }} />
          기간: {moment(start).format('YYYY-MM-DD HH:mm')} ~ {moment(end).format('YYYY-MM-DD HH:mm')}
        </p>
        <div style={{ marginTop: '15px', textAlign: 'right' }}>
          <Button size="small" style={{ marginRight: '8px' }} onClick={() => onEdit(event)}>
            수정
          </Button>
          <Popconfirm
            title="정말 삭제하시겠습니까?"
            onConfirm={() => onDelete(event.id)}
            okText="예"
            cancelText="아니오"
          >
            <Button size="small" type="danger">삭제</Button>
          </Popconfirm>
        </div>
      </div>
    );
  };

  // 이벤트 내용 커스텀 렌더링
  const renderEventContent = (eventInfo) => {
    const category = eventInfo.event.extendedProps.category;
    const { color, icon } = categoryMap[category] || { color: '#d9d9d9', icon: <QuestionCircleOutlined /> };
    
    // importanceMap에서 borderColor를 사용하여 배경색 설정
    const importance = eventInfo.event.extendedProps.importance;
    const eventBackgroundColor = importanceMap[importance]?.borderColor || color;
    const eventTextColor = importanceMap[importance]?.textColor || 'white';

    return (
      // FullCalendar의 eventContent는 HTML 요소를 반환해야 합니다.
      // Popover를 직접 eventContent에 넣으면, FullCalendar 내부 구조와 충돌할 수 있습니다.
      // 대신, Popover의 대상이 될 요소를 렌더링하고, Popover는 별도의 상태로 관리하여
      // FullCalendar의 eventClick 콜백에서 팝오버를 제어하는 것이 일반적입니다.
      // 그러나 Ant Design Popover는 trigger="click"을 지원하므로, 여기에 직접 넣는 방식도 가능합니다.
      // 이 경우, FullCalendar의 eventClick은 Popover가 열리는 행위를 처리하게 됩니다.

      // 중요: Popover의 visible 속성과 onVisibleChange를 사용하여 제어를 강화합니다.
      <Popover
        content={
          <EventPopoverContent
            event={eventInfo.event}
            onEdit={(event) => {
              showEventModal({ event });
            }}
            onDelete={handleDeleteEvent}
          />
        }
        title="일정 상세"
        trigger="click" // 클릭 시 팝오버 표시
        placement="right"
        getPopupContainer={trigger => trigger.parentNode} // 캘린더 내부에서 렌더링
        // visible={popoverEvent && popoverEvent.id === eventInfo.event.id && popoverVisible} // 특정 이벤트에 대해서만 Popover 표시
        // onVisibleChange={(newVisible) => {
        //   // FullCalendar의 eventClick이 먼저 실행되어 Popover 상태를 변경하므로,
        //   // Popover 내부의 컨트롤(버튼 등)에 의해 닫히는 경우를 처리해야 합니다.
        //   if (!newVisible && popoverVisible) { // Popover가 닫히려고 할 때만 상태 업데이트
        //     handlePopoverClose();
        //   }
        // }}
        open={popoverEvent && popoverEvent.id === eventInfo.event.id && popoverOpen} // visible -> open
        onOpenChange={(newOpen) => { // onVisibleChange -> onOpenChange
          if (!newOpen && popoverOpen) {
            handlePopoverClose();
          }
        }}
      >
        <div className="fc-event-main-content" style={{
          backgroundColor: eventBackgroundColor, // 중요도에 따른 배경색 적용
          color: eventTextColor, // 중요도에 따른 텍스트 색상 적용
          padding: '2px 5px',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '12px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          cursor: 'pointer' // 클릭 가능 표시
        }}>
          {icon}
          <span>{eventInfo.timeText} {eventInfo.event.title}</span>
        </div>
      </Popover>
    );
  };

  // 목표 추가 모달 또는 인라인 입력 필드
  const addGoal = (date) => {
    const goalText = prompt(`"${moment(date).format('YYYY-MM-DD')}"의 목표를 입력하세요:`);
    if (goalText) {
      setGoals([...goals, {
        id: String(Date.now()),
        text: goalText,
        date: moment(date).startOf('week').format('YYYY-MM-DD'), // 해당 주의 시작 날짜
        isCompleted: false,
      }]);
      message.success('새 주간 목표가 추가되었습니다!');
    }
  };

  const toggleGoalCompletion = (id) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, isCompleted: !goal.isCompleted } : goal
    ));
    message.info('주간 목표 상태가 변경되었습니다.');
  };

  // 주 번호 렌더링 커스텀 (목표 추가 버튼)
  const renderWeekNumberContent = (info) => {
    const weekStartDate = moment(info.date).startOf('week').format('YYYY-MM-DD');
    const weekGoals = goals.filter(goal => goal.date === weekStartDate);

    return (
      <div className="custom-week-number">
        <span>{info.num}주차</span>
        <Button
          size="small"
          type="text"
          icon={<PushpinOutlined />}
          onClick={() => addGoal(info.date)}
          title="주간 목표 추가"
        />
        {weekGoals.length > 0 && (
          <div className="week-goals-list">
            {weekGoals.map(goal => (
              <div key={goal.id} className="week-goal-item">
                <Checkbox checked={goal.isCompleted} onChange={() => toggleGoalCompletion(goal.id)}>
                  <span style={{ textDecoration: goal.isCompleted ? 'line-through' : 'none' }}>
                    {goal.text}
                  </span>
                </Checkbox>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>나만의 스마트 캘린더</h1>
        <div className="filter-section">
          <label htmlFor="category-filter">카테고리 필터</label>
          <Select
            id="category-filter"
            defaultValue="all"
            style={{ width: 140 }}
            onChange={value => setFilterCategory(value)}
            placeholder="카테고리 선택"
          >
            <Option value="all">전체</Option>
            {Object.keys(categoryMap).map(cat => (
              <Option key={cat} value={cat}>
                <Tag color={categoryMap[cat].color} icon={categoryMap[cat].icon}>
                  {cat}
                </Tag>
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => showEventModal()}
          >
            새 일정 추가
          </Button>
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, momentPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' // 목록 뷰 추가
        }}
        buttonText={{
          today: '오늘',
          month: '월',
          week: '주',
          day: '일',
          list: '목록'
        }}
        locale="ko"
        weekends={true}
        editable={true}
        selectable={true}
        events={events}
        //events={getFilteredEvents()} // 필터링된 이벤트 전달
        dateClick={showEventModal} // 날짜 클릭 시 새 일정 모달 열기
        eventClick={handleEventClick} // 이벤트 클릭 시 수정 모달 열기 (Popover를 통해 호출)
        eventDrop={handleEventDrop} // 드래그앤드롭 후 API 호출
        eventResize={handleEventResize} // 리사이즈 후 API 호출
        eventContent={renderEventContent} // 커스텀 이벤트 렌더링 (팝오버 포함)
        height="auto" // 캘린더 높이 자동 조절
        weekNumbers={true} // 주 번호 표시 활성화
        weekNumberContent={renderWeekNumberContent} // 주 번호 커스텀 렌더링 (주간 목표)
        dayCellContent={(arg) => { // 날짜 셀 요일 제거
            return arg.dayNumberText;
        }}
        weekText="주차" // 주 번호 텍스트
      />

      {/* 일정 추가/수정 모달 */}
      <Modal
        title={currentEvent ? "일정 수정" : "새 일정 추가"}
        //visible={isModalVisible}
        open={isModalOpen} // visible -> open
        onOk={handleOk}
        onCancel={() => {
          //setIsModalVisible(false);
          setIsModalOpen(false);
          form.resetFields(); // 모달 닫을 때 폼 초기화
        }}
        footer={[
          currentEvent && ( // 수정 모드일 때만 삭제 버튼 표시
            <Popconfirm
              key="delete-event-popconfirm" 
              title="정말 이 일정을 삭제하시겠습니까?"
              onConfirm={() => handleDeleteEvent(currentEvent.id)}
              okText="삭제"
              cancelText="취소"
            >
              <Button type="danger">삭제</Button>
            </Popconfirm>
          ),
          <Button key="back" onClick={() => {
            //setIsModalVisible(false);
            setIsModalOpen(false);
            form.resetFields();
          }}>
            취소
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {currentEvent ? "수정" : "추가"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="일정 제목"
            rules={[{ required: true, message: '일정 제목을 입력해주세요!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="일정 기간"
            rules={[{ required: true, message: '일정 기간을 선택해주세요!' }]}
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="category"
            label="카테고리"
            rules={[{ required: true, message: '카테고리를 선택해주세요!' }]}
          >
            <Select placeholder="카테고리 선택">
              {Object.keys(categoryMap).map(cat => (
                <Option key={cat} value={cat}>
                  <Tag color={categoryMap[cat].color} icon={categoryMap[cat].icon}>
                    {cat}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="importance"
            label="중요도"
            rules={[{ required: true, message: '중요도를 선택해주세요!' }]}
          >
            <Select placeholder="중요도 선택">
              {Object.keys(importanceMap).map(imp => (
                <Option key={imp} value={imp}>
                  <Tag color={importanceMap[imp].tagColor}>{imp}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MyCalendar;