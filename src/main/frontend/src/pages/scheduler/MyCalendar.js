import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './custom-calendar.css'; // 커스텀 CSS 파일 임포트

class MyCalendar extends Component {
    render() {
        return (
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
          />
        );
    }
}
export default MyCalendar;