package com.example.reactdemo.web.model.entity.routine;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

/**
 * 루틴 반복 규칙의 상세정보 저장
 * @since 2025.06.27
 */
@Entity
@Getter
@Setter
@Table(name = "tbl_routine_repeat_rule")
public class RoutineRepeat {

    @Id
    @Column(name = "repeat_rule_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long repeatId;
    @Column(name = "repeat_type", nullable = false)
    private int repeatType;
    // 반복 간격
    @Column(name = "repeat_interval")
    private int repeatInterval = 1;    // default 값 1
    // 월 기준 반복 시 일 (1~31)
    @Column(name = "day_of_month")
    private int dayOfMonth;
    // 월 기준 몇 번째 주 (1~5)
    @Column(name = "week_of_month")
    private int weekOfMonth;
    // 월 기준 반복 요일
    @Column(name = "day_of_week_for_month")
    private String dayOfWeekForMonth;
    @Column(name = "start_dt")
    private Timestamp startDt;
    @Column(name = "end_dt")
    private Timestamp endDt;
    @Column(name = "update_dt")
    private Timestamp updateDt;
}
