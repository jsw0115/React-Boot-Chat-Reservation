package com.example.reactdemo.web.model.dto.routine;

import com.example.reactdemo.web.model.entity.routine.Routine;
import lombok.Getter;

@Getter
public class RoutineDashboardResponseDto {

    private Long id;
    private String title;
    private String category;
    private boolean isActive;
    private int priority;

    public RoutineDashboardResponseDto(Routine routine) {
        this.id = routine.getRoutineId();
        this.title = routine.getTitle();
        this.category = routine.getCategory();
        this.isActive = routine.isActive();
        this.priority = routine.getPriority();
    }
}
