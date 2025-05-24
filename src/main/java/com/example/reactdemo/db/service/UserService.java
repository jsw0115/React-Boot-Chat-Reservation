package com.example.reactdemo.db.service;

import com.example.reactdemo.db.repository.UserRepository;
import com.example.reactdemo.enums.UserRole;
import com.example.reactdemo.util.helper.UtcHelper;
import com.example.reactdemo.util.security.PasswordEncryptor;
import com.example.reactdemo.web.model.dto.CustomUserDetails;
import com.example.reactdemo.web.model.entity.User;
import com.example.reactdemo.web.model.models.JsonResultApiModel;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Optional;

/**
 * User 정보 관련 Service
 * @since 2025.05.17
 * */
@Service
@RequiredArgsConstructor
public class UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

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

                message = "중복된 아이디입니다.";
                isSuccess = false;
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
}
