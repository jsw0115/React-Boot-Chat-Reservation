package com.example.reactdemo.web.apicontroller;

import com.example.reactdemo.db.service.UserService;
import com.example.reactdemo.web.model.entity.User;
import com.example.reactdemo.web.model.models.JsonResultApiModel;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import javax.security.sasl.AuthenticationException;
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
    private final AuthenticationManager authenticationManager;

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
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginInfo, HttpServletRequest httpRequest) {

        logger.info("AccountApiController, login");

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginInfo.get("userAccountId"), loginInfo.get("password"));
        Map<String, Object> result = new HashMap<>();
        JsonResultApiModel results = new JsonResultApiModel();

        try {

            //
            results = userService.login(loginInfo.get("userAccountId"), loginInfo.get("password"));
            String userAccountId = loginInfo.get("userAccountId");

            Authentication authentication = authenticationManager.authenticate(token);

            SecurityContext context = SecurityContextHolder.getContext();
            context.setAuthentication(authentication);

            httpRequest.getSession().invalidate();
            HttpSession session = httpRequest.getSession(true);

            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
            session.setMaxInactiveInterval(1800);
            session.setAttribute("userAccountId", userAccountId);

        } catch (Exception e) {

            logger.error("AcoountApiController, login Exception 발생 {}", e.getMessage());
            results.isSuccess = false;
            results.message = "로그인 실패";
            results.resultCode = HttpStatus.UNAUTHORIZED.hashCode();
        }

        result.put("isSuccess", results.isSuccess);
        result.put("message", results.message);

        return ResponseEntity.ok(result);
    }

    /**
     * 로그아웃 API Controller
     *
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request) {

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        Map<String, Object> result = new HashMap<>();
        JsonResultApiModel results = new JsonResultApiModel();

        result.put("message", "logout");
        result.put("isSuccess", true);

        return ResponseEntity.ok(result);
    }
}
