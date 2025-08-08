package com.example.reactdemo.web.model.entity.routine;

import com.example.reactdemo.web.model.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;


/**
 * 루틴 관리 테이블
 * @since 2025.06.25
 */
@Entity
@Table(name = "tbl_routine")
@Getter
@Setter
public class Routine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "routine_id")
    private long routineId;
    private String title;
    private String category;
    private String memo;
    @Column(name = "start_time")
    private Timestamp startTime;
    @Column(name = "end_time")
    private Timestamp endTime;
    @Column(name = "is_active")
    private boolean isActive;
    @Column(name = "create_dt", nullable = false)
    private Timestamp createDt;
    @Column(name = "update_dt", nullable = false)
    private Timestamp updateDt;
    // 2025.08.03 jsw - 컬럼 추가
    @Column(name = "priority", nullable = false)
    private int priority; // 1: 높음, 2: 중간, 3: 낮음

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repeat_rule_id")
    private RoutineRepeat routineRepeat;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Task> tasks;
}
