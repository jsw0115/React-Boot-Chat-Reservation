import React, { useState, Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './custom-calendar.css'; // 커스텀 CSS 파일 임포트
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list'; // 목록 뷰 플러그인
import momentPlugin from '@fullcalendar/moment'; // 날짜 포맷팅을 위한 Moment.js 플러그인 (필요시)
import moment from 'moment'; // Moment.js 임포트 (필요시)
import 'moment/locale/ko'; // 한국어 로케일 (필요시)
//import './BeautifulCalendar.css'; // 커스텀 CSS 임포트
import { Modal, Button, Form, Input, DatePicker, Select, Tag, Popconfirm } from 'antd'; // Ant Design 사용 예시
import { CalendarOutlined, PushpinOutlined, TeamOutlined, QuestionCircleOutlined } from '@ant-design/icons'; // Ant Design 아이콘 임포트
import { Popover } from 'antd';
import { Checkbox } from 'antd'; // Ant Design Checkbox 임포트

// Moment.js 한국어 설정
moment.locale('ko');

const { RangePicker } = DatePicker;
const { Option } = Select;
//
//function class MyCalendar extends Component {
function MyCalendar() {
  const [events, setEvents] = useState([]); // 이벤트 목록
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 여부
  const [currentEvent, setCurrentEvent] = useState(null); // 수정할 이벤트
  const [form] = Form.useForm(); // Ant Design 폼
  const [goals, setGoals] = useState([]); // { id, text, date, isCompleted }

  // 이벤트 추가/수정 모달 열기
  const showEventModal = (info = null) => {
    setCurrentEvent(info ? info.event : null);
    if (info && info.event) {
      form.setFieldsValue({
        title: info.event.title,
        dateRange: info.event.start && info.event.end ?
          [moment(info.event.start), moment(info.event.end)] : null,
        category: info.event.extendedProps.category,
        importance: info.event.extendedProps.importance, // 중요도 설정
      });
    } else {
      form.resetFields();
      // 새 일정 추가 시 기본 중요도 설정 (옵션)
      form.setFieldsValue({ importance: '일반' });
    }
    setIsModalVisible(true);
  };

  // 이벤트 추가/수정 제출 핸들러
  const handleOk = () => {
    form.validateFields().then(values => {
      const { title, dateRange, category, importance } = values; // importance 추가
      const newEvent = {
        title,
        start: dateRange[0].toISOString(),
        end: dateRange[1].toISOString(),
        extendedProps: { category, importance }, // importance 추가
        id: currentEvent ? currentEvent.id : String(Date.now()),
        // 중요도에 따른 이벤트 배경색 및 테두리 색상 설정
        backgroundColor: importanceMap[importance]?.borderColor || categoryMap[category]?.color,
        borderColor: importanceMap[importance]?.borderColor || categoryMap[category]?.color,
        textColor: importanceMap[importance]?.textColor || 'white',
      };

      if (currentEvent) {
        // 이벤트 수정
        setEvents(events.map(e => e.id === newEvent.id ? newEvent : e));
      } else {
        // 이벤트 추가
        setEvents([...events, newEvent]);
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // 날짜 클릭 핸들러 (새 일정 추가)
  const handleDateClick = (info) => {
    form.setFieldsValue({
      dateRange: [moment(info.dateStr), moment(info.dateStr).add(1, 'hour')] // 기본 1시간 간격
    });
    showEventModal();
  };

  // 이벤트 드롭 (드래그앤드롭으로 날짜 변경)
  const handleEventDrop = (info) => {
    const updatedEvents = events.map(event => {
      if (event.id === info.event.id) {
        return {
          ...event,
          start: info.event.startStr,
          end: info.event.endStr,
          extendedProps: { ...event.extendedProps, category: info.event.extendedProps.category } // 카테고리도 유지
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  // 이벤트 리사이즈 (시간 변경)
  const handleEventResize = (info) => {
    const updatedEvents = events.map(event => {
      if (event.id === info.event.id) {
        return {
          ...event,
          start: info.event.startStr,
          end: info.event.endStr,
          extendedProps: { ...event.extendedProps, category: info.event.extendedProps.category }
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  // 이벤트 클릭 (수정 모달 열기)
  const handleEventClick = (info) => {
    showEventModal(info);
  };

  // 이벤트 삭제
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setIsModalVisible(false); // 모달 닫기
  };

  // 필터링 기능 (카테고리)
  const [filterCategory, setFilterCategory] = useState('all'); // 필터링할 카테고리

  const getFilteredEvents = () => {
    if (filterCategory === 'all') {
      return events;
    }
    return events.filter(event => event.extendedProps.category === filterCategory);
  };

  const EventPopoverContent = ({ event, onEdit, onDelete }) => {
    const { title, start, end, extendedProps } = event;
    const { category } = extendedProps;
    const { color, icon } = categoryMap[category] || { color: '#d9d9d9', icon: <QuestionCircleOutlined /> };

    return (
      <div>
        <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag color={color} icon={icon}>{category}</Tag>
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
  
  // 카테고리별 색상 및 아이콘 매핑 (더 예쁜 색상 팔레트)
  const categoryMap = {
    '업무': { color: '#1890ff', icon: <CalendarOutlined /> }, // Ant Blue
    '개인': { color: '#52c41a', icon: <PushpinOutlined /> }, // Ant Green
    '회의': { color: '#faad14', icon: <TeamOutlined /> },   // Ant Gold
    '기타': { color: '#f5222d', icon: <QuestionCircleOutlined /> }, // Ant Red
  };

  const importanceMap = {
    '긴급': { tagColor: 'red', borderColor: '#cf1322', textColor: 'white' },
    '중요': { tagColor: 'volcano', borderColor: '#d4380d', textColor: 'white' },
    '일반': { tagColor: 'green', borderColor: '#389e0d', textColor: 'white' },
  };


  // 이벤트 내용 커스텀 렌더링 수정
  const renderEventContent = (eventInfo) => {
    const category = eventInfo.event.extendedProps.category;
    const { color, icon } = categoryMap[category] || { color: '#d9d9d9', icon: <QuestionCircleOutlined /> }; // 기본값

    return (
      <Popover
        content={
          <EventPopoverContent
            event={eventInfo.event}
            onEdit={(event) => {
              showEventModal({ event }); // Popover에서 수정 모달 열기
              // Popover를 닫는 로직이 필요할 수 있습니다.
              // Ant Design Popover는 보통 마우스 벗어나면 닫히지만, 수동 제어가 필요할 때도 있습니다.
            }}
            onDelete={handleDeleteEvent}
          />
        }
        title="일정 상세"
        trigger="click" // 클릭 시 팝오버 표시
        placement="right"
        getPopupContainer={trigger => trigger.parentNode} // 캘린더 내부에서 렌더링
      >
        <div style={{
          backgroundColor: color,
          color: 'white',
          padding: '2px 5px',
          borderRadius: '4px', // 모서리 둥글게
          fontWeight: 'bold',
          fontSize: '12px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          display: 'flex',
          alignItems: 'center',
          gap: '5px' // 아이콘과 텍스트 간 간격
        }}>
          {icon}
          <span>{eventInfo.timeText} {eventInfo.event.title}</span>
        </div>
      </Popover>
    );
  };

  // // 이벤트 내용 커스텀 렌더링
  // const renderEventContent = (eventInfo) => {
  //   const categoryColors = {
  //     '업무': 'purple',
  //     '개인': 'blue',
  //     '회의': 'green',
  //     '기타': 'orange',
  //   };
  //   const categoryColor = categoryColors[eventInfo.event.extendedProps.category] || '#3788d8';

  //   return (
  //     <div style={{
  //       backgroundColor: categoryColor,
  //       color: 'white',
  //       padding: '2px 5px',
  //       borderRadius: '3px',
  //       fontWeight: 'bold',
  //       fontSize: '12px',
  //       overflow: 'hidden',
  //       whiteSpace: 'nowrap',
  //       textOverflow: 'ellipsis'
  //     }}>
  //       {/* 아이콘 추가 (Font Awesome 사용 가정) */}
  //       {eventInfo.event.extendedProps.category === '업무' && <i className="fas fa-briefcase" style={{ marginRight: '5px' }}></i>}
  //       {eventInfo.event.extendedProps.category === '개인' && <i className="fas fa-user" style={{ marginRight: '5px' }}></i>}
  //       {eventInfo.event.extendedProps.category === '회의' && <i className="fas fa-comments" style={{ marginRight: '5px' }}></i>}
  //       {eventInfo.event.extendedProps.category === '기타' && <i className="fas fa-fas fa-info-circle" style={{ marginRight: '5px' }}></i>}
  //       <b>{eventInfo.timeText}</b>
  //       <i>{eventInfo.event.title}</i>
  //     </div>
  //   );
  // };

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
    }
  };

  const toggleGoalCompletion = (id) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, isCompleted: !goal.isCompleted } : goal
    ));
  };

  // 주 번호 렌더링 커스텀 (목표 추가 버튼)
  const renderWeekNumberContent = (info) => {
    // 해당 주의 시작 날짜 가져오기
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

  
  //render() {
    return (
      <div className="calendar-container">
      <div className="calendar-header">
        <h1>나만의 스마트 캘린더</h1>
        <div className="filter-section">
          {/* 필터 섹션 수정 */}
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
            icon={<CalendarOutlined />} // 아이콘 추가
            onClick={() => showEventModal()}
          >
            새 일정 추가
          </Button>
        </div>
      </div>
      
      {/* ... (FullCalendar 컴포넌트) */}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        // 헤더 툴바 커스터마이징
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay' // 원하는 뷰만 표시
        }}
        // 버튼 텍스트 변경
        buttonText={{
          today: '오늘',
          month: '월별',
          week: '주별',
          day: '일별'
        }}
        // 날짜 포맷 변경
        dayCellContent={(arg) => {
          return arg.dayNumberText; // 날짜만 표시, 요일 제거
        }}
        // 주 번호 표시
        weekNumbers={true}
        // 주 번호 텍스트 포맷
        weekText="주차"
        weekNumberContent={renderWeekNumberContent} // 주 번호 커스텀 렌더링
      />
      {/* 일정 추가/수정 모달 */}
      <Modal
        title={currentEvent ? "일정 수정" : "새 일정 추가"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          currentEvent && (
            <Popconfirm
              title="정말 이 일정을 삭제하시겠습니까?"
              onConfirm={() => handleDeleteEvent(currentEvent.id)}
              okText="삭제"
              cancelText="취소"
            >
              <Button type="danger">삭제</Button>
            </Popconfirm>
          ),
          <Button key="back" onClick={() => setIsModalVisible(false)}>
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
        </Form>
      </Modal>
    </div>
    );
  //}
}
export default MyCalendar;