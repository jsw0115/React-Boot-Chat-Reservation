package com.example.reactdemo.web.model.dto.routine;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 루틴 생성을 위한 요청 Dto
 * @since 2025.08.16
 */
public class RoutineCreateDto {

    private String title;
    private String description;
    private LocalDateTime startTime;
    private Map<String, Object> repeatSchedule;     // ex) {"type": "weekly", "days": ["MON", "WED"]}
    private List<TaskCreateDto> tasks;
}
