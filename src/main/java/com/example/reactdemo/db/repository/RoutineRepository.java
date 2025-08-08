package com.example.reactdemo.db.repository;

import com.example.reactdemo.web.model.entity.routine.Routine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * 루틴 관련 Repository
 * @author jsw
 * @since 2025.08.03
 */
public interface RoutineRepository extends JpaRepository<Routine, Long> {

    // 특정 사용자의 루틴 조회
    List<Routine> findByUserId(Long userId);
    // 우선순위 오름차순으로 나오도록
    List<Routine> findByUserIdOrderByPriorityAsc(Long userId);
}
