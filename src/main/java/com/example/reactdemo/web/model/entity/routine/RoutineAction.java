package com.example.reactdemo.web.model.entity.routine;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

/**
 * 루틴 행동 목록을 저장하는 테이블
 * @since 2025.06.27
 */
@Entity
@Getter
@Setter
@Table(name = "tbl_routine_action")
public class RoutineAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long actionId;
    private String content;
    @Column(name = "action_order")
    private int actionOrder;
    @Column(name = "update_dt")
    private Timestamp updateDt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id")
    private Routine routine;
}
