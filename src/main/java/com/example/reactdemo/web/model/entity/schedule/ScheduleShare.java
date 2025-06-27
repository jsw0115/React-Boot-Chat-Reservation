package com.example.reactdemo.web.model.entity.schedule;

import com.example.reactdemo.web.model.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 일정 공유 테이블
 *
 * @since 2025.06.28
 */
@Entity
@Getter
@Setter
@Table(name = "tbl_schedule_share")
public class ScheduleShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private int permission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with_user_id")
    private User user;
}
