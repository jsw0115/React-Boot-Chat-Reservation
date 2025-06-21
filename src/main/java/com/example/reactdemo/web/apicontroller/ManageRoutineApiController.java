package com.example.reactdemo.web.apicontroller;

import com.example.reactdemo.web.model.dto.routine.RoutineDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * 루틴관리 페이지 관련 api
 * API 로 소통되도록
 * @since 20250621
 */
@CrossOrigin(origins = "http://localhost:3000")     // CORS 오류일 가능성 존재
@RestController
@RequestMapping("/api/manage/routine")
@RequiredArgsConstructor
public class ManageRoutineApiController {

    private final Logger logger = LoggerFactory. getLogger(this.getClass());

    /**
     * 루틴관리 목록 가져오는 api Controller
     * @param
     * @return ResponseEntity
     * @since 2025.06.21
     */
    @GetMapping("/list")
    public List<RoutineDto> getRoutines() {

        List<RoutineDto> result = new ArrayList<>();
        logger.info("ManageRoutineApiController, getRoutines");

        return result;
    }
}
