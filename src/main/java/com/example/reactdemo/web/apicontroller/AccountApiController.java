package com.example.reactdemo.web.apicontroller;

import com.example.reactdemo.db.service.UserService;
import com.example.reactdemo.web.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 */
@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountApiController {

    private final UserService userService;

    /**
     * 회원가입 Api Controller
     * @param user
     * @return ResponseEntity
     * @since 2025.05.18
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register (@RequestBody User user) {

        Map<String, Object> result = new HashMap<>();
        String status = userService.register(user);
        result.put("message", status);

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

        Map<String, Object> result = new HashMap<>();
        boolean success = userService.login(loginInfo.get("userAccountId"), loginInfo.get("password"));
        result.put("success", success);

        return ResponseEntity.ok(result);
    }
}
