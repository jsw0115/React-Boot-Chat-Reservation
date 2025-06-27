package com.example.reactdemo.web.model.entity.schedule;

import com.example.reactdemo.web.model.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

/**
 * 일정 정보
 * @since 2025.06.28
 */
@Entity
@Getter
@Setter
@Table(name = "tbl_schedule_repeat_rule")
public class ScheduleRepeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repeat_rule_id")
    private long repeatRuleId;
    @Column(name = "repeat_type")
    private int repeatType;
    @Column(name = "repeat_interval")
    private int repeatInterval;
    @Column(name = "start_dt", nullable = false)
    private Timestamp startDt;
    @Column(name = "end_dt", nullable = false)
    private Timestamp endDt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;
}
