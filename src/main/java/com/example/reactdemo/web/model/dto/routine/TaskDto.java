package com.example.reactdemo.web.model.dto.routine;

public record TaskDto(
        Long id,    
        String content,  // 활동 내용
        short taskType,  // 활동 유형 ("CHECK", "COUNT", "TIMER")
        int goalCount,  // 목표 횟수 (taskType이 "COUNT"일 때 사용, 예: 3)
        int timerInSeconds  // 타이머 시간(초) (taskType이 "TIMER"일 때 사용, 예: 1800)
) {}
