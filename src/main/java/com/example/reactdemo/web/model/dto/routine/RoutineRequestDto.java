package com.example.reactdemo.web.model.dto.routine;

import java.sql.Timestamp;
import java.util.List;

public record RoutineRequestDto(
        int id,
        String title,
        String category,
        String memo,
//        String startDtStr,
//        String endDtStr,
        Timestamp startTime,
        Timestamp endTime,
        String startTimeStr,
        String endTimeStr,
        List<String> repeatDays,      // ex: ["월", "수", "금"]
        int repeatType,
        int repeatInterval,
        // 월간 반복 옵션 (필요 시 사용)
        int dayOfMonth,
        int weekOfMonth,
        // 반복 기간
        Timestamp startDt,
        Timestamp endDt,
        String startDtStr,
        String endDtStr,
        List<TaskDto> tasks
) {}
