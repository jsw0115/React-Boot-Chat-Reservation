package com.example.reactdemo.db.repository;

import com.example.reactdemo.web.model.dto.scheduler.ScheduleModelDto;
import com.example.reactdemo.web.model.entity.schedule.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 일정 관련 repository
 * @since 2025.06.28
 */
@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findScheduleListByUserId(long userId);
    Optional<Schedule> findByScheduleId(long scheduleId);
    @Query("SELECT s FROM Schedule s JOIN FETCH s.user WHERE s.scheduleId = :id")
    Optional<Schedule> findByIdWithUser(@Param("id") Long id);
    @Query("SELECT new com.example.reactdemo.web.model.dto.scheduler.ScheduleModelDto(s.scheduleId, s.title, s.startDt, s.endDt, u.id, u.username) " +
            "FROM Schedule s JOIN s.user u WHERE s.scheduleId = :id")
    Optional<ScheduleModelDto> findScheduleDtoById(@Param("id") Long id);
}
