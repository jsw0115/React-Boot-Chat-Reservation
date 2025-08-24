package com.example.reactdemo.web.model.entity.routine;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_task")
@Getter
@Setter
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(nullable = false)
    private String content;

//    private boolean isCompleted = false;

    // 2025.08.24 컬럼 추가
    @Column(name = "task_order", nullable = false)
    private int taskOrder; // 활동 순서

    @Column(name = "task_type")
    private short taskType; // 1:체크, 2:횟수, 3:타이머

    @Column(name = "goal_count")
    private int goalCount; // 목표 횟수

    @Column(name = "timer_in_seconds")
    private int timerInSeconds; // 타이머 시간(초)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id")
    private Routine routine;

    public Task(){}

    @Builder
    public Task(String content, Routine routine) {
        this.content = content;
        this.routine = routine;
    }

//    // 완료 상태를 토글하는 메서드
//    public void toggleComplete() {
//        this.isCompleted = !this.isCompleted;
//    }
}
