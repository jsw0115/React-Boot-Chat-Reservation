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
@Table(name = "tbl_schedule")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private int scheduleId;
    private String title;
    private String description;
    @Column(name = "start_dt", nullable = false)
    private Timestamp startDt;
    @Column(name = "end_dt", nullable = false)
    private Timestamp endDt;
    @Column(name = "create_dt", nullable = false)
    private Timestamp createDt;
    @Column(name = "update_dt", nullable = false)
    private Timestamp updateDt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
