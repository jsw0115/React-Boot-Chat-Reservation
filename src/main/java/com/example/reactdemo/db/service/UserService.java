package com.example.reactdemo.db.service;

import com.example.reactdemo.db.repository.EmailVerificationTokenRepository;
import com.example.reactdemo.db.repository.PasswordResetTokenRepository;
import com.example.reactdemo.db.repository.UserRepository;
import com.example.reactdemo.enums.ProviderEnum;
import com.example.reactdemo.enums.UserRole;
import com.example.reactdemo.util.helper.UtcHelper;
import com.example.reactdemo.util.security.PasswordEncryptor;
import com.example.reactdemo.web.model.entity.EmailVerificationToken;
import com.example.reactdemo.web.model.entity.User;
import com.example.reactdemo.web.model.models.JsonResultApiModel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

/**
 * User 정보 관련 Service
 * @since 2025.05.17
 * */
@Service
@RequiredArgsConstructor
public class UserService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final EmailService emailService; // EmailService 주입
    private final EmailVerificationTokenRepository emailVerificationTokenRepository; // EmailVerificationTokenRepository 주입
    private final PasswordResetTokenRepository passwordResetTokenRepository; // PasswordResetTokenRepository 주입

    /**
     * 회원가입 로직 생성
     * @param user
     * @since 2025.05.24
     *
     * @return JsonResultApiModel
     */
    public JsonResultApiModel register (User user) {

        JsonResultApiModel results = new JsonResultApiModel();
        boolean isSuccess = false;
        String message = "";

        try {

            if (userRepository.existsByUserAccountId(user.getUserAccountId())) {

                message = "이미 사용 중인 아이디입니다.";
                isSuccess = false;
//            } else if (userRepository.existsByEmail(user.getEmail())) {
//
//                message = "이미 가입된 이메일입니다.";
//                isSuccess = false;
            } else {

                // 회원가입 정보
                Timestamp utcNow = UtcHelper.getUtcNow();
                String encodedPasswd = PasswordEncryptor.encode(user.getPassword());

                user.setRole(UserRole.USER_ROLE.getCode());
                user.setPassword(encodedPasswd);
                user.setCreateDt(utcNow);
                user.setUpdateDt(utcNow);
                user.setUseYN((short)1);

                userRepository.save(user);
                isSuccess = true;
            }
        } catch (Exception e) {

            logger.error("UserService,Register Exception 발생 {}");
            isSuccess = false;
            message = "회원가입 도중 오류가 발생하였습니다.";
        }

        results.message = message;
        results.isSuccess = isSuccess;

        return results;
    }

    /**
     * 로그인 로직
     * @param userAccountId
     * @param password
     * @since 2025.05.24
     *
     * @return JsonResultApiModel
     */
    public JsonResultApiModel login (String userAccountId, String password) {

        logger.info("UserService, login");
        JsonResultApiModel result = new JsonResultApiModel();
        boolean isSuccess = false;
        String message = "";

        try {

            User user = userRepository.findByUserAccountId(userAccountId)
                    .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userAccountId));

            // 권한(role)을 문자열로 가져오기 (ex: "USER", "ADMIN")
            String role =  UserRole.fromCode(user.getRole()).getRoleName(); // ex: "USER" → ROLE_USER로 자동 처리됨
            boolean match = PasswordEncryptor.matches(password, user.getPassword()); // 테스트용

            logger.info("비밀번호 매치 여부: {}", match);

            logger.info("role ? {}", role);
            logger.info("user.getUsername() ? {}", user.getUsername());
            logger.info("user.getPassword() ? {}", user.getPassword());

            if (match) {

                isSuccess = true;
            } else {

                logger.info("해당하는 유저가 존재하지 않습니다.");
                message = "해당하는 유저가 존재하지 않습니다.";
                isSuccess =  false;
            }
        } catch (Exception e) {

            logger.error("UserService,login Exception 발생 {}", e.getMessage());
            message = "로그인 도중 오류가 발생하였습니다.";
            isSuccess = false;
        }

        result.isSuccess = isSuccess;
        result.message = message;

        return result;
    }

    public User loadOrRegisterOAuthUser(String email) {
        return userRepository.findByEmail(email)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername(email.split("@")[0]); // 임시 이름
                newUser.setProvider(ProviderEnum.KAKAO.getCode()); // 또는 "google", "kakao"
                newUser.setRole(UserRole.USER_ROLE.getCode());
                return userRepository.save(newUser);
            });
    }

    /**
     * 이메일 인증 코드 전송
     * @param email
     */
    @Transactional
    public JsonResultApiModel sendEmailVerificationCode(String email) {

        JsonResultApiModel result = new JsonResultApiModel();
        // 이미 해당 이메일로 가입된 유저가 있는지 확인
        if (userRepository.findByEmail(email).isPresent()) {

            throw new IllegalArgumentException("이미 가입된 이메일입니다. 로그인 해주세요");
        }

        // 기존에 발급된 미사용 토큰이 있다면 삭제하거나 갱신
        emailVerificationTokenRepository.findByEmail(email).ifPresent(emailVerificationTokenRepository::delete);

        String verificationCode = UUID.randomUUID().toString().substring(0, 6); // 6자리 코드 생성
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(10); // 10분 유효

        EmailVerificationToken token = new EmailVerificationToken(verificationCode, email, expiryDate);
        emailVerificationTokenRepository.save(token);

        String subject = "[내 서비스] 이메일 인증 코드입니다.";
        String text = "회원가입을 완료하려면 다음 인증 코드를 입력해주세요: " + verificationCode + "\n\n" +
                "이 코드는 10분 동안 유효합니다.";
        emailService.sendEmail(email, subject, text);

        return result;
    }

    /**
     * 6자리 랜덤 숫자 코드 생성
    */
    private String createRandomCode() {

        Random random = new Random();
        int code = 100000 + random.nextInt(900000);

        return String.valueOf(code);
    }
}
