package com.example.reactdemo.web.model.dto.routine;

import java.sql.Timestamp;
import java.util.List;

public record RoutineRequestDto(
        String title,
        String category,
        String memo,
        Timestamp startTime,
        Timestamp endTime,
        List<String> repeatDays,      // ex: ["월", "수", "금"]
        int repeatType,
        int repeatInterval,
        int dayOfMonth,
        int weekOfMonth,
        Timestamp startDt,
        Timestamp endDt,
        List<TaskDto> tasks
) {}
