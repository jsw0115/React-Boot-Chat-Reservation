package com.example.reactdemo.db.service;

import com.example.reactdemo.db.repository.RoutineRepeatRepository;
import com.example.reactdemo.db.repository.RoutineRepository;
import com.example.reactdemo.db.repository.TaskRepository;
import com.example.reactdemo.db.repository.UserRepository;
import com.example.reactdemo.web.model.dto.routine.RoutineDashboardResponseDto;
import com.example.reactdemo.web.model.dto.routine.RoutineRequestDto;
import com.example.reactdemo.web.model.dto.routine.RoutineResponseDto;
import com.example.reactdemo.web.model.entity.User;
import com.example.reactdemo.web.model.entity.routine.Routine;
import com.example.reactdemo.web.model.entity.routine.RoutineRepeat;
import com.example.reactdemo.web.model.entity.routine.Task;
import com.example.reactdemo.web.model.models.JsonResultApiModel;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

/**
 *
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final RoutineRepeatRepository routineRepeatRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private static final Logger logger = LoggerFactory.getLogger(RoutineService.class);

    /**
     * 오늘 요일에 맞는 루틴 조회
     * @param userAccountId
     * @return JsonResultApiModel result
     * @author jsw
     * @since 2025.08.03
     */
    @GetMapping("/getTodayRoutines")
    public JsonResultApiModel getTodayRoutines(String userAccountId) {

        JsonResultApiModel result = new JsonResultApiModel();
        List<RoutineResponseDto> results = new ArrayList<>();

        try {

            User user = userRepository.findByUserAccountId(userAccountId).orElseThrow();
            long userId = user.getId();
            List<Routine> routines = routineRepository.findByUserId(userId);
            DayOfWeek today = LocalDate.now().getDayOfWeek();   // MONDAY, TUESDAY ...
            String todayKor = today.getDisplayName(TextStyle.SHORT, Locale.KOREAN);

            results = routines.stream()
                    .filter(routine -> {
                        RoutineRepeat repeat = routine.getRoutineRepeat();
                        if (repeat == null) return false;

                        int repeatType = repeat.getRepeatType(); // 1: 매일, 2: 주중, 3: 주말, 4: 특정 요일
                        String dayOfWeekStr = repeat.getDayOfWeekForMonth(); // ex: "월,화,금"

                        return switch (repeatType) {
                            case 1 -> true; // 매일
                            case 2 -> !Set.of("토", "일").contains(todayKor); // 주중
                            case 3 -> Set.of("토", "일").contains(todayKor); // 주말
                            case 4 -> dayOfWeekStr != null && dayOfWeekStr.contains(todayKor); // 특정 요일
                            default -> false;
                        };
                    })
                    .map(RoutineResponseDto::new)
                    .collect(Collectors.toList());

            result.jsonResult = results;
            result.isSuccess = true;
        } catch (Exception e) {

            logger.error("Excpetion 발생 {}", e);
            result.isSuccess = false;
            result.jsonResult = null;
            result.message = "getTodayRoutines 실행 중 예외 발생";
        }

        return result;
    }

    /**
     * 루틴 생성 서비스
     * @param userAccountId
     * @param dto
     * @since 2025.08.03
     * @return JsonResultApiModel resultApiModel
     */
    @Transactional
    public JsonResultApiModel createRoutine(String userAccountId, RoutineRequestDto dto) {

        JsonResultApiModel resultApiModel = new JsonResultApiModel();
        Routine result = new Routine();
        User user = userRepository.findByUserAccountId(userAccountId).orElseThrow();
        if (user != null) {

            try {

                // 1. 루틴 반복 생성
                RoutineRepeat repeat = new RoutineRepeat();
                repeat.setRepeatType(dto.repeatType());
                repeat.setRepeatInterval(dto.repeatInterval());
                repeat.setDayOfMonth(dto.dayOfMonth());
                repeat.setWeekOfMonth(dto.weekOfMonth());
                repeat.setDayOfWeekForMonth(String.join(",", dto.repeatDays())); // "월,수,금"
                repeat.setStartDt(dto.startDt());
                repeat.setEndDt(dto.endDt());
                repeat.setUpdateDt(Timestamp.from(Instant.now()));
                routineRepeatRepository.save(repeat);

                // 2. 루틴 생성
                Routine routine = new Routine();
                routine.setTitle(dto.title());
                routine.setCategory(dto.category());
                routine.setMemo(dto.memo());
                routine.setStartTime(dto.startTime());
                routine.setEndTime(dto.endTime());
                routine.setActive(true);
                routine.setCreateDt(Timestamp.from(Instant.now()));
                routine.setUpdateDt(Timestamp.from(Instant.now()));
                routine.setUser(user);
                routine.setRoutineRepeat(repeat);

                // 3. Task 리스트 생성
                List<Task> tasks = dto.tasks().stream()
                        .map(taskDto -> {
                            Task task = new Task();
                            task.setContent(taskDto.content());
                            task.setRoutine(routine);
                            return task;
                        })
                        .collect(Collectors.toList());
                routine.setTasks(tasks);

                result = routineRepository.save(routine);

                resultApiModel.isSuccess = true;
                resultApiModel.message = "createRoutine 실행 성공";
                resultApiModel.jsonResult = result;
            } catch (Exception e) {

                logger.error("createRoutine 실행 중 오류 발생 {}", e);
                resultApiModel.isSuccess = false;
                resultApiModel.message = "createRoutine 실행 중 오류 발생";
                resultApiModel.jsonResult = null;
            }
        } else {

            resultApiModel.isSuccess = false;
            resultApiModel.message = "사용자 정보가 없습니다.";
            resultApiModel.jsonResult = userAccountId;
        }

        return resultApiModel;
    }

    /**
     * 루틴 수정 서비스
     * @param routineId
     * @param userAccountId
     * @param dto
     * @since 2025.08.03
     * @return JsonResultApiModel result
     */
    @Transactional
    public JsonResultApiModel updateRoutine(Long routineId, String userAccountId, RoutineRequestDto dto) {

        JsonResultApiModel result = new JsonResultApiModel();
        Routine routine = routineRepository.findById(routineId).orElseThrow();
        User user = userRepository.findByUserAccountId(userAccountId).orElseThrow();
        if(routine != null && user != null) {

            try {

                routine.setTitle(dto.title());
                routine.setCategory(dto.category());
                routine.setMemo(dto.memo());
                routine.setStartTime(dto.startTime());
                routine.setEndTime(dto.endTime());
                routine.setUpdateDt(Timestamp.from(Instant.now()));

                // 반복 규칙 수정
                RoutineRepeat repeat = routine.getRoutineRepeat();
                repeat.setRepeatType(dto.repeatType());
                repeat.setRepeatInterval(dto.repeatInterval());
                repeat.setDayOfMonth(dto.dayOfMonth());
                repeat.setWeekOfMonth(dto.weekOfMonth());
                repeat.setDayOfWeekForMonth(String.join(",", dto.repeatDays()));
                repeat.setStartDt(dto.startDt());
                repeat.setEndDt(dto.endDt());
                repeat.setUpdateDt(Timestamp.from(Instant.now()));

                result.isSuccess = true;
                result.message = "SUCCESS";
                result.jsonResult = "SUCCESS";
            } catch (Exception e) {

                logger.error("updateRoutine 실행 중 오류 발생 {}", e);
                result.isSuccess = false;
                result.message = "updateRoutine 실행 중 오류 발생";
                result.jsonResult = null;
            }
        } else if (user == null) {

            logger.error("해당 유저는 수정할 수 없습니다.");
            result.isSuccess = false;
            result.message = "해당 유저는 수정할 수 없습니다.";
            result.jsonResult = userAccountId;
        } else if (routine == null) {

            logger.error("업데이트 할 Routine이 없습니다.");
            result.isSuccess = false;
            result.message = "업데이트 할 Routine이 없습니다.";
            result.jsonResult = routineId;
        }

        return result;
    }

    /**
     * 루틴 삭제 서비스
     * @param routineId
     * @param userAccountId
     * @since 2025.08.03
     * @return JsonResultApiModel result
     */
    @Transactional
    public JsonResultApiModel deleteRoutine(Long routineId, String userAccountId) {

        JsonResultApiModel result = new JsonResultApiModel();
        User user = userRepository.findByUserAccountId(userAccountId).orElseThrow();
        Routine routine = routineRepository.findById(routineId).orElseThrow();
        if (user != null && routine != null) {

            try {

                routineRepository.delete(routine);

                result.isSuccess = true;
                result.message = "SUCCESS";
                result.jsonResult = "SUCCESS";
            } catch (Exception e) {

                logger.error("deleteRoutine 실행 중 오류 발생 {}", e);
                result.isSuccess = false;
                result.message = "deleteRoutine 실행 중 오류 발생";
                result.jsonResult = null;
            }
        } else if (user == null) {

            logger.error("해당 유저는 수정할 수 없습니다.");
            result.isSuccess = false;
            result.message = "해당 유저는 수정할 수 없습니다.";
            result.jsonResult = userAccountId;
        } else if (routine == null) {

            logger.error("업데이트 할 Routine이 없습니다.");
            result.isSuccess = false;
            result.message = "업데이트 할 Routine이 없습니다.";
            result.jsonResult = routineId;
        }

        return result;
    }

    /**
     * Task 완료 상태 토글 서비스
     * @param taskId
     * @param userAccountId
     * @since 2025.08.03
     * @return JsonResultApiModel result
     */
    @Transactional
    public JsonResultApiModel toggleTaskComplete(Long taskId, String userAccountId) {

        JsonResultApiModel result = new JsonResultApiModel();
        User user = userRepository.findByUserAccountId(userAccountId).orElseThrow();
        Task task = taskRepository.findById(taskId).orElseThrow();
        if (user != null && task != null) {

            try {

                task.setCompleted(!task.isCompleted());

                result.isSuccess = true;
                result.message = "SUCCESS";
                result.jsonResult = "SUCCESS";
            } catch (Exception e) {

                logger.error("toggleTaskComplete 실행 중 오류 발생 {}", e);
                result.isSuccess = false;
                result.message = "toggleTaskComplete 실행 중 오류 발생";
                result.jsonResult = null;
            }
        } else if (user == null) {

            logger.error("해당 유저는 수정할 수 없습니다.");
            result.isSuccess = false;
            result.message = "해당 유저는 수정할 수 없습니다.";
            result.jsonResult = userAccountId;
        } else if (task == null) {

            logger.error("업데이트 할 Task가 없습니다.");
            result.isSuccess = false;
            result.message = "업데이트 할 Task가 없습니다.";
            result.jsonResult = taskId;
        }

        return result;
    }

    /**
     * 루틴 대시보드 목록 (중요도순 정렬)
     *
     * @param userAccountId
     * @return JsonResultApiModel
     */
    public JsonResultApiModel getRoutineDashboard(String userAccountId) {

        JsonResultApiModel result = new JsonResultApiModel();
        User user = userRepository.findByUserAccountId(userAccountId).orElseThrow();
        long userId = user.getId();
        if (user != null) {

            try {

                List<Routine> routines = routineRepository.findByUserIdOrderByPriorityAsc(userId);
                List<RoutineDashboardResponseDto> routineList = routines.stream()
                        .map(RoutineDashboardResponseDto::new)
                        .collect(Collectors.toList());

                result.isSuccess = true;
                result.jsonResult = routineList;
            } catch (Exception e) {
                logger.error("루틴 대시보드 조회 오류: {}", e.getMessage(), e);
                result.isSuccess = false;
                result.message = "루틴 대시보드 조회 중 예외 발생";
            }
        } else {

            result.isSuccess = false;
            result.message = "사용자 정보가 없습니다.";
            result.jsonResult = userAccountId;
        }
        return result;
    }
}
