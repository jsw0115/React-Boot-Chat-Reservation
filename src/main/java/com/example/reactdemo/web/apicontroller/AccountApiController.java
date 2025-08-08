package com.example.reactdemo.web.apicontroller;

import com.example.reactdemo.db.service.AccountService;
import com.example.reactdemo.db.service.UserService;
import com.example.reactdemo.util.security.JwtProvider;
import com.example.reactdemo.web.model.dto.user.ApiResponse;
import com.example.reactdemo.web.model.dto.user.CheckIdRequestDto;
import com.example.reactdemo.web.model.dto.user.EmailVerificationRequest;
import com.example.reactdemo.web.model.dto.user.LoginRequestDto;
import com.example.reactdemo.web.model.entity.User;
import com.example.reactdemo.web.model.models.JsonResultApiModel;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.validation.BindingResult;
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
    private final AccountService accountService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

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

            SecurityContextHolder.getContext().setAuthentication(authentication);
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
     * @param request
     * @return ResonseEntity
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request) {

        logger.info("AccountApiController, logout Start");
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

    /**
     * jwt 토큰으로 로그인하는 방식
     * @since 2025.06.28
     * @param   loginRequest
     * @param   bindingResult
     * @since 2025.07.18
     * @apiNote
     */
    @PostMapping("/jwtLogin")
    public ResponseEntity<?> jwtLogin(@Valid @RequestBody LoginRequestDto loginRequest, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("Invalid input");
        }

        try {
            // AuthenticationManager로 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUserAccountId(), loginRequest.getPassword())
            );

            // authentication.getPrincipal()은 UserDetails 타입임을 명시적 캐스팅
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // 인증 성공 시 토큰 생성
            String token = jwtProvider.generateToken(userDetails);

            logger.info("token ? " + token);
            return ResponseEntity.ok().body(new JwtResponse(token));
        } catch (BadCredentialsException ex) {

            // 프론트엔드에 401 응답과 에러 메시지를 보내는 것은 그대로 유지합니다.
            // 메시지를 사용자 친화적으로 변경하는 것이 좋습니다.
            return ResponseEntity.status(401).body(new ErrorResponse("아이디 또는 비밀번호가 일치하지 않습니다."));
        } catch (AuthenticationException ex) {

            logger.error("Authentication failed, ex {}", ex);
            return ResponseEntity.status(401).body(new ErrorResponse("Authentication failed"));
        }
    }

    /**
     * 이메일 인증 코드 발송
     * @param request
     * @return ResponseEntity
     */
    @RequestMapping(method = RequestMethod.POST, path = "/sendVerificationCode")
    public ResponseEntity<ApiResponse<?>> sendVerificationCode(@Valid @RequestBody EmailVerificationRequest request) {

        JsonResultApiModel result = new JsonResultApiModel();
        try {
            result = userService.sendEmailVerificationCode(request.getEmail());

            return ResponseEntity.ok(ApiResponse.success("인증 코드가 이메일로 발송되었습니다.", result));
        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {

            logger.error("이메일 인증 코드 발송 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("서버 오류가 발생했습니다."));
        }
    }

    /**
     * 이메일 인증코드 확인 API
     * @param requestDto
     * @return ResponseEntity
     */
    @RequestMapping(value = "/sendVertificationCode", method = RequestMethod.POST)
    public ResponseEntity<ApiResponse<?>> sendVertificationCode(@RequestBody @Valid EmailVerificationRequest requestDto) {

        JsonResultApiModel result = new JsonResultApiModel();
        try {

            result = accountService.verifyEmailCode(requestDto.getEmail(), requestDto.getVertificationCode());
            return ResponseEntity.ok(ApiResponse.success("인증 코드가 이메일로 발송되었습니다.", result));
        } catch (Exception e) {

            logger.error("이메일 인증코드 확인 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("서버 오류가 발생했습니다."));
        }
    }

    /**
     * 아이디 중복 확인
     * @param requestDto
     * @return ResponseEntity
     * @since 2025.07.27
     */
    @RequestMapping(value = "/checkId", method = RequestMethod.POST)
    public ResponseEntity<ApiResponse<?>> checkId(@RequestBody @Valid CheckIdRequestDto requestDto) {

        JsonResultApiModel result = new JsonResultApiModel();
        try {

            result = accountService.isIdAvailable(requestDto.getUserAccountId());
            return ResponseEntity.ok(ApiResponse.success("아이디 중복 확인 성공", result));
        } catch (Exception e) {

            logger.error("아이디 중복 확인 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("서버 오류가 발생했습니다."));
        }
    }


    /**
     * JWT 토큰 반환용 DTO
     */
    public static class JwtResponse {
        private String token;

        public JwtResponse(String token) {
            this.token = token;
        }
        public String getToken() {
            return token;
        }
        public void setToken(String token) {
            this.token = token;
        }
    }

    /**
     * 에러 메시지 DTO
     */
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
        public String getMessage() {
            return message;
        }
        public void setMessage(String message) {
            this.message = message;
        }
    }
}
