package com.example.reactdemo.db.service;

import com.example.reactdemo.db.repository.ScheduleRepository;
import com.example.reactdemo.db.repository.UserRepository;
import com.example.reactdemo.util.helper.UtcHelper;
import com.example.reactdemo.web.model.dto.scheduler.ScheduleModelDto;
import com.example.reactdemo.web.model.dto.scheduler.ScheduleParamModelDto;
import com.example.reactdemo.web.model.entity.User;
import com.example.reactdemo.web.model.entity.schedule.Schedule;
import com.example.reactdemo.web.model.models.JsonResultApiModel;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * 일정 Service 로직
 * @since 2025.06.28
 */
@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final UserRepository userRepository;

    /**
     * 사용자의 일정 가져오기
     * @since 2025.06.28
     * @param param
     * @return JsonResultApiModel
     */
    public JsonResultApiModel getScheduleList(ScheduleParamModelDto param) {

        JsonResultApiModel result = new JsonResultApiModel();

        try {

            List<Schedule> scheduleDataList = new ArrayList<>();
            User user = userRepository.findByUserAccountId(param.getUserAccountId()).orElseThrow();
            long userId = user.getId();

            // 일정 목록 엔티티 조회
            scheduleDataList = scheduleRepository.findScheduleListByUserId(userId);
            List<ScheduleModelDto> scheduleList = new ArrayList<>();
            ScheduleModelDto model = new ScheduleModelDto();
            User SchedulerUser = new User();
            for (Schedule schedule : scheduleDataList) {

                model = new ScheduleModelDto();
                model = scheduleRepository.findScheduleDtoById(schedule.getScheduleId())
                        .orElseThrow(() -> new UsernameNotFoundException("일정을 찾을 수 없습니다: " + schedule.getScheduleId()));;
//                SchedulerUser = schedule.getUser();
//                model.setId(schedule.getScheduleId());
//                model.setTitle(schedule.getTitle());
//                //model.setImportance();
//                model.setStartTime(schedule.getStartDt().toLocalDateTime());
//                model.setEndTime(schedule.getEndDt().toLocalDateTime());
//                model.setUserId(SchedulerUser.getId());
//                model.setUserName(SchedulerUser.getUsername());

                scheduleList.add(model);
            }

            result.jsonResult = scheduleList;
            result.resultCode = 1;
            result.isSuccess = true;
        } catch (Exception e) {

            logger.error("ScheduleService, getScheduleList Exception 발생, {}", e);
            result.isSuccess = false;
            result.jsonResult = new ArrayList<ScheduleModelDto>();
            result.resultCode = 0;
        }

        return result;
    }

    /**
     * 사용자의 일정 저장하기
     * @since 2025.06.28
     * @param param
     * @return JsonResultApiModel
     */
    public JsonResultApiModel createSchedule(ScheduleModelDto param) {

        logger.info("ScheduleService, createSchedule");
        JsonResultApiModel result = new JsonResultApiModel();

        try {

            User user = userRepository.findByUserAccountId(param.getUserAccountId()).orElseThrow();

            Schedule schedule = Schedule.builder()
                    .title(param.getTitle())
                    .createDt(UtcHelper.getUtcNow())
                    .description(param.getTitle())
                    .startDt(Timestamp.valueOf(param.getStartTime()))
                    .endDt(Timestamp.valueOf(param.getEndTime()))
                    .updateDt(UtcHelper.getUtcNow())
                    .user(user)
                    .build();

            scheduleRepository.save(schedule);

        } catch (Exception e) {

            logger.error("ScheduleService, createSchedule Exception 발생, {}", e);
            result.isSuccess = false;
            result.responseCode = "SUCCESS";
            result.resultCode = 0;
        }

        return result;
    }
}
