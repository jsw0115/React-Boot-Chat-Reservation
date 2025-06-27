package com.example.reactdemo.web.model.entity.schedule;

import com.example.reactdemo.web.model.entity.routine.RoutineRepeat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 루틴 주간 반복 요일
 * @since 2025.06.28
 */
@Entity
@Getter
@Setter
@Table(name = "tbl_schedule_weekly_day")
public class ScheduleWeeklyDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "day_of_week")
    private int dayOfWeek;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repeat_rule_id")
    private ScheduleRepeat scheduleRepeat;
}
