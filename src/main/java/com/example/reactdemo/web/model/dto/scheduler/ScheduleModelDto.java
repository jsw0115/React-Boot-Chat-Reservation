package com.example.reactdemo.web.model.dto.scheduler;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data // Lombok: @Getter, @Setter, @ToString, @EqualsAndHashCode 자동 생성
//@NoArgsConstructor // Lombok: 기본 생성자 자동 생성 (JSON 역직렬화에 필요)
@AllArgsConstructor // Lombok: 모든 필드를 인자로 받는 생성자 자동 생성
public class ScheduleModelDto {

    private long id; // 이벤트의 고유 ID (백엔드에서 생성/관리)
    private String title; // 일정 제목
    private LocalDateTime startTime; // 시작 시간 (ISO 8601 형식 문자열로 주고받음)
    private LocalDateTime endTime; // 종료 시간
    //private Timestamp startDt; // 시작 시간 (ISO 8601 형식 문자열로 주고받음)
    //private Timestamp endDt; // 종료 시간
    private String category; // 카테고리 (예: "업무", "개인", "회의", "기타")
    private String importance; // 중요도 (예: "긴급", "중요", "일반")
    private boolean allDay; // 종일 여부 (true/false)
    private long userId;
    private String userAccountId;
    private String userName;
    // 일정 반복 여부
    // 필요에 따라 description, location 등 추가 필드를 여기에 정의할 수 있습니다.

    public ScheduleModelDto() {}

    public ScheduleModelDto(Long scheduleId, String title, Timestamp startDt, Timestamp endDt, Long userId, String userName) {
        this.id = scheduleId;
        this.title = title;
//        this.startDt = startDt;
//        this.endDt = endDt;
        this.startTime = startDt.toLocalDateTime();  // Timestamp → LocalDateTime 변환
        this.endTime = endDt.toLocalDateTime();
        this.userId = userId;
        this.userName = userName;
    }
}
