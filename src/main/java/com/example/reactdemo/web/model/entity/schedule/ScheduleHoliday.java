package com.example.reactdemo.web.model.entity.schedule;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

/**
 * 공휴일 테이블
 * @since 2025.06.28
 */
@Entity
@Getter
@Setter
@Table(name = "tbl_schedule_holiday")
public class ScheduleHoliday {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "holiday_date")
    private Timestamp holidayDate;
    @Column(name = "holiday_name")
    private String holidayName;
    @Column(name = "country_code")
    private String countryCode;
    @Column(name = "is_holiday")
    private boolean isHoliday;
}
