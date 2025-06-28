package com.example.reactdemo.web.apicontroller;

import com.example.reactdemo.db.service.ScheduleService;
import com.example.reactdemo.web.model.dto.scheduler.ScheduleModelDto;
import com.example.reactdemo.web.model.dto.scheduler.ScheduleParamModelDto;
import com.example.reactdemo.web.model.models.JsonResultApiModel;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 일정 관련 api
 * API 로 소통되도록
 * @since 2025.06.28
 */
@CrossOrigin(origins = "http://localhost:3000")     // CORS 오류일 가능성 존재
@RestController
@RequestMapping("/api/scheduler")
@RequiredArgsConstructor
public class SchedulerApiController {

    private final Logger logger = LoggerFactory. getLogger(this.getClass());
    private final ScheduleService scheduleService;

    /**
     * 일정 목록 조회 API
     * @since 2025.06.28
     * @apiNote GET /api/scheduler
     * @param param
     * @return results
     */
    @GetMapping
    public List<ScheduleModelDto> getScheduleList(
            @AuthenticationPrincipal UserDetails userDetails,
            ScheduleParamModelDto param) {

        List<ScheduleModelDto> results = new ArrayList<>();
        JsonResultApiModel result = new JsonResultApiModel();

        if (param != null) {

            String userAccountId = userDetails.getUsername();
            param.setUserAccountId(userAccountId);
            result = scheduleService.getScheduleList(param);
            results = (List<ScheduleModelDto>) result.jsonResult;
        } else {

            results = new ArrayList<>();
        }

        return results;
    }

    /**
     * 일정 저장
     * @since 2025.06.28
     * @apiNote POST /api/scheduler
     * @param param
     * @return result
     */
    @PostMapping
    public JsonResultApiModel createSchedule(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ScheduleModelDto param) {

        JsonResultApiModel result = new JsonResultApiModel();

        if (param != null) {

            logger.info("SchedulerApiController, createSchedule");
            String userAccountId = userDetails.getUsername();
            logger.info("userDetails userAccountId ? " + userAccountId);
            param.setUserAccountId(userAccountId);
            result = scheduleService.createSchedule(param);
        } else {

            logger.error("param is NULL");
        }

        return result;
    }

    /**
     * 일정 수정
     * @since 2025.06.28
     * @apiNote PUT /api/scheduler
     * @param id
     * @param param
     * @return results
     */
    @PutMapping("/{id}") // URL 경로에서 ID를 변수로 받음
    public ResponseEntity<ScheduleModelDto> updateSchedule(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody ScheduleModelDto param) {
        // 해당 ID의 일정이 존재하는지 확인
//        if (!events.containsKey(id)) {
//            // 없으면 HTTP 404 Not Found 반환
//            return ResponseEntity.notFound().build();
//        }
        // 요청 본문으로 받은 객체에 URL의 ID를 설정 (데이터 일관성 유지)
        param.setId(id);
        //events.put(id, scheduleDto); // 기존 이벤트 덮어쓰기
        // HTTP 200 OK 상태 코드와 함께 업데이트된 이벤트 객체 반환
        return ResponseEntity.ok(param);
    }
}
