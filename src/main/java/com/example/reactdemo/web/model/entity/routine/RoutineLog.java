package com.example.reactdemo.web.model.entity.routine;

import com.example.reactdemo.web.model.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

/**
 * 루틴 행동 테이블
 * @since 2025.06.27
 */
@Entity
@Getter
@Setter
@Table(name = "tbl_routine_log")
public class RoutineLog {

    @Id
    @Column(name = "log_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long logId;
    @Column(name = "is_success")
    private boolean isSuccess;
    private String memo;
    @Column(name = "performance_date", nullable = false)
    private Timestamp performanceDt;
    @Column(name = "create_dt", nullable = false)
    private Timestamp createDt;
    @Column(name = "update_dt", nullable = false)
    private Timestamp updateDt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id")
    private Routine routine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
  