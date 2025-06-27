package com.example.reactdemo.web.model.entity.routine;

import com.example.reactdemo.web.model.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

/**
 * 루틴 공유 테이블
 * @since 2025.06.28
 */
@Entity
@Getter
@Setter
@Table(name = "routine_share")
public class RoutineShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "share_id")
    private long shareId;
    private int permission;
    private int status;
    @Column(name = "create_dt", nullable = false)
    private Timestamp createDt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id")
    private Routine routine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
