package com.example.reactdemo.db.repository;

import com.example.reactdemo.web.model.entity.routine.RoutineRepeat;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 루틴 반복 관련 Repository
 * @author jsw
 * @since 2025.08.03
 */
public interface RoutineRepeatRepository extends JpaRepository<RoutineRepeat, Long> {


}
