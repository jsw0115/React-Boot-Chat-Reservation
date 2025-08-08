package com.example.reactdemo.web.model.entity.routine;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_routine")
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

    private boolean isCompleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id")
    private Routine routine;

    public Task(){}

    @Builder
    public Task(String content, Routine routine) {
        this.content = content;
        this.routine = routine;
    }

    // 완료 상태를 토글하는 메서드
    public void toggleComplete() {
        this.isCompleted = !this.isCompleted;
    }
}
