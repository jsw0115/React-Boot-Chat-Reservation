package com.example.reactdemo.web.apicontroller;

import com.example.reactdemo.db.service.RoutineService;
import com.example.reactdemo.web.model.dto.routine.RoutineRequestDto;
import com.example.reactdemo.web.model.dto.user.ApiResponse;
import com.example.reactdemo.web.model.models.JsonResultApiModel;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * 루틴 관리 컨트롤러
 * @since 2025.08.03
 * @author jsw
 */
@RestController
@RequestMapping("/api/routines")
@RequiredArgsConstructor
public class RoutineApiController {

    private final RoutineService routineService;
    private static final Logger logger = LoggerFactory.getLogger(RoutineApiController.class);

    /**
     * 중요도 기준으로 정렬된 루틴 목록 조회 (루틴 대시보드)
     * @author jsw
     * @since 2025.08.03
     */
    @GetMapping("/getRoutineDashboard")
    public ResponseEntity<ApiResponse<?>> getRoutineDashboard(@AuthenticationPrincipal UserDetails userDetails) {

        logger.info("RoutineApiController, getRoutineDashboard");
        try {

            String userAccountId = userDetails.getUsername();
            JsonResultApiModel result = routineService.getRoutineDashboard(userAccountId);
            return ResponseEntity.ok(ApiResponse.success("루틴 대시보드 목록 조회 성공", result));
        } catch (Exception e) {
            logger.error("루틴 대시보드 컨트롤러 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("서버 오류가 발생했습니다."));
        }
    }

    /**
     * 오늘 요일에 해당하는 루틴 조회
     * @param userDetails
     * @return ResponseEntity_ApiResponse
     */
    @GetMapping("/getTodayRoutines")
    public ResponseEntity<ApiResponse<?>> getTodayRoutines(@AuthenticationPrincipal UserDetails userDetails) {

        logger.info("SchedulerApiController, createSchedule");
        try {
            String userAccountId = userDetails.getUsername();
            JsonResultApiModel result = routineService.getTodayRoutines(userAccountId);
            return ResponseEntity.ok(ApiResponse.success("오늘 루틴 조회 성공", result));
        } catch (Exception e) {
            logger.error("오늘 루틴 조회 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("오늘 루틴 조회 중 오류가 발생했습니다."));
        }
    }

    /**
     * 루틴 전체 조회
     * @param userDetails
     * @return ResponseEntity_ApiResponse
     */
    @GetMapping("/getRoutines")
    public ResponseEntity<ApiResponse<?>> getRoutines(@AuthenticationPrincipal UserDetails userDetails) {

        logger.info("RoutineApiController, getRoutines");
        try {
            String userAccountId = userDetails.getUsername();
            JsonResultApiModel result = routineService.getRoutines(userAccountId);
            return ResponseEntity.ok(ApiResponse.success("오늘 루틴 조회 성공", result));
        } catch (Exception e) {
            logger.error("오늘 루틴 조회 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("오늘 루틴 조회 중 오류가 발생했습니다."));
        }
    }

    /**
     * 루틴 생성
     * @param userDetails
     * @param requestDto
     *
     * @return ResponseEntity_ApiResponse
     * @since 2025.08.03
     */
    @PostMapping("/createRoutine")
    public ResponseEntity<ApiResponse<?>> createRoutine(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid RoutineRequestDto requestDto) {

        logger.info("SchedulerApiController, createRoutine");
        if (requestDto != null) {

            logger.info("requestDto, title ? " + requestDto.title());
            logger.info("requestDto, category ? " + requestDto.category());
            logger.info("requestDto, memo ? " + requestDto.memo());
            logger.info("requestDto, startTime ? " + requestDto.startTime());
            logger.info("requestDto, endTime ? " + requestDto.endTime());
            logger.info("requestDto, repeatDays ? " + requestDto.repeatDays());
            logger.info("requestDto, repeatType ? " + requestDto.repeatType());
            logger.info("requestDto, repeatInterval ? " + requestDto.repeatInterval());
            logger.info("requestDto, dayOfMonth ? " + requestDto.dayOfMonth());
            logger.info("requestDto, weekOfMonth ? " + requestDto.weekOfMonth());
            logger.info("requestDto, startDt ? " + requestDto.startDt());
            logger.info("requestDto, endDt ? " + requestDto.endDt());
            logger.info("requestDto, tasks ? " + requestDto.tasks());
        }
        try {
            String userAccountId = userDetails.getUsername();
            JsonResultApiModel result = routineService.createRoutine(userAccountId, requestDto);
            return ResponseEntity.ok(ApiResponse.success("루틴 생성 성공", result));
        } catch (Exception e) {
            logger.error("루틴 생성 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("루틴 생성 중 오류가 발생했습니다."));
        }
    }

    /**
     * 루틴 수정
     * @param routineId
     * @param userDetails
     * @param requestDto
     *
     * @return ResponseEntity_ApiResponse
     * @since 2025.08.03
     */
    @PutMapping("/updateRoutine")
    public ResponseEntity<ApiResponse<?>> updateRoutine(@PathVariable Long routineId,
                                                        @AuthenticationPrincipal UserDetails userDetails,
                                                        @RequestBody @Valid RoutineRequestDto requestDto) {
        logger.info("SchedulerApiController, updateRoutine");
        try {
            String userAccountId = userDetails.getUsername();
            JsonResultApiModel result = routineService.updateRoutine(routineId, userAccountId, requestDto);
            return ResponseEntity.ok(ApiResponse.success("루틴 수정 성공", result));
        } catch (Exception e) {
            logger.error("루틴 수정 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("루틴 수정 중 오류가 발생했습니다."));
        }
    }

    /**
     * 루틴 삭제
     * @param routineId
     * @param userDetails
     *
     * @return ResponseEntity_ApiResponse
     * @since 2025.08.03
     */
    @DeleteMapping("/deleteRoutine")
    public ResponseEntity<ApiResponse<?>> deleteRoutine(@PathVariable Long routineId,
                @AuthenticationPrincipal UserDetails userDetails) {

        logger.info("SchedulerApiController, deleteRoutine");
        try {
            String userAccountId = userDetails.getUsername();
            JsonResultApiModel result = routineService.deleteRoutine(routineId, userAccountId);
            return ResponseEntity.ok(ApiResponse.success("루틴 삭제 성공", result));
        } catch (Exception e) {
            logger.error("루틴 삭제 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("루틴 삭제 중 오류가 발생했습니다."));
        }
    }

    /**
     * Task 완료 상태 토글
     * @param taskId
     * @param userDetails
     *
     * @return ResponseEntity_ApiResponse
     * @since 2025.08.03
     */
    @PatchMapping("/toggleTaskComplete")
    public ResponseEntity<ApiResponse<?>> toggleTaskComplete(@PathVariable Long taskId,
                                 @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("SchedulerApiController, toggleTaskComplete");
        try {
            String userAccountId = userDetails.getUsername();
            JsonResultApiModel result = routineService.toggleTaskComplete(taskId, userAccountId);
            return ResponseEntity.ok(ApiResponse.success("Task 완료 상태 변경 성공", result));
        } catch (Exception e) {
            logger.error("Task 상태 변경 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Task 상태 변경 중 오류가 발생했습니다."));
        }
    }
}
