package com.example.reactdemo.web.model.dto.routine;

import com.example.reactdemo.web.model.entity.routine.Routine;
import com.example.reactdemo.web.model.entity.routine.RoutineRepeat;
import com.example.reactdemo.web.model.entity.routine.Task;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public record RoutineResponseDto(
        Long id,
        String title,
        RepeatRuleDto repeatRule,
        List<TaskDto> tasks,
//        int completedTaskCount,
        int totalTaskCount,
        Timestamp startTime, // 추가
        Timestamp endTime    // (필요시 endTime도)
) {
    public RoutineResponseDto(Routine routine) {
        this(
                routine.getRoutineId(),
                routine.getTitle(),
                new RepeatRuleDto(routine.getRoutineRepeat()),
                routine.getTasks().stream()
                        .map(task -> new TaskDto(task.getId(), task.getContent(), task.getTaskType(), task.getGoalCount(), task.getTimerInSeconds()))
                        .collect(Collectors.toList()),
//                (int) routine.getTasks().stream().filter(Task::isCompleted).count(),
                routine.getTasks().size(),
                routine.getStartTime(),  // 추가
                routine.getEndTime()     // 추가
        );
    }

    public record RepeatRuleDto(
            long repeatId,
            int repeatType,
            int repeatInterval,
            int dayOfMonth,
            int weekOfMonth,
            String dayOfWeekForMonth,
            Timestamp startDt,
            Timestamp endDt,
            Timestamp updateDt
    ) {
        public RepeatRuleDto(RoutineRepeat repeat) {
            this(
                    repeat.getRepeatId(),
                    repeat.getRepeatType(),
                    repeat.getRepeatInterval(),
                    repeat.getDayOfMonth(),
                    repeat.getWeekOfMonth(),
                    repeat.getDayOfWeekForMonth(),
                    repeat.getStartDt(),
                    repeat.getEndDt(),
                    repeat.getUpdateDt()
            );
        }
    }
}
