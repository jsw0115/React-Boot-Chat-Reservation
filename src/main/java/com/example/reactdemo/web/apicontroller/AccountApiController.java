package com.example.reactdemo.web.apicontroller;

import com.example.reactdemo.db.service.UserService;
import com.example.reactdemo.web.model.entity.User;
import com.example.reactdemo.web.model.models.JsonResultApiModel;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 계정 로그인, 회원가입 시 사용하는 로직
 * API 로 소통되도록
 * @since 20250519
 */
@CrossOrigin(origins = "http://localhost:3000")     // CORS 오류일 가능성 존재
@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountApiController {

    private final Logger logger = LoggerFactory. getLogger(this.getClass());
    private final UserService userService;

    /**
     * 회원가입 Api Controller
     * @param user
     * @return ResponseEntity
     * @since 2025.05.18
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register (@RequestBody User user) {

        logger.info("AccountApiController, register");
        Map<String, Object> result = new HashMap<>();
        JsonResultApiModel results = new JsonResultApiModel();
        results = userService.register(user);

        result.put("isSuccess", results.isSuccess);
        result.put("message", results.message);

        return ResponseEntity.ok(result);
    }

    /**
     *  로그인 Api Controller
     * @param loginInfo
     * @return ResponseEntity
     * @since 2025.05.18
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginInfo) {

        logger.info("AccountApiController, login");
        Map<String, Object> result = new HashMap<>();
        JsonResultApiModel results = new JsonResultApiModel();
        results = userService.login(loginInfo.get("userAccountId"), loginInfo.get("password"));

        result.put("isSuccess", results.isSuccess);
        result.put("message", results.message);

        return ResponseEntity.ok(result);
    }
}
