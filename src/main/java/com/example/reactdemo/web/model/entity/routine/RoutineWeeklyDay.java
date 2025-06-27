package com.example.reactdemo.web.model.entity.routine;

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
@Table(name = "tbl_routine_weekly_day")
public class RoutineWeeklyDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "day_of_week")
    private int dayOfWeek;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_id")
    private RoutineRepeat routineRepeat;
}
