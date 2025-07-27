package com.example.reactdemo.db.service;

import com.example.reactdemo.db.repository.UserRepository;
import com.example.reactdemo.util.helper.RedisUtil;
import com.example.reactdemo.web.model.entity.User;
import com.example.reactdemo.web.model.models.JsonResultApiModel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/***
 *  로그인 및 회원가입 시, 지나가는 서비스 로직
 * @since 2025.05.17
 * */
@Service
@RequiredArgsConstructor
public class AccountService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final RedisUtil redisUtil;
    private final UserRepository userRepository;

    /**
     *  user
     *
     */
    //@Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = new User();

        logger.info("username ? " + username);

        return null;
    }

    /**
     *  이메일 인증코드 검증
     * @param email
     * @param code
     * @return JsonResultApiModel
     */
    public JsonResultApiModel verifyEmailCode(@NotBlank(message = "이메일을 입력해주세요.") @Email(message = "유효한 이메일 주소를 입력해주세요.") String email, String code) {

        JsonResultApiModel result = new JsonResultApiModel();
        String storedCode = redisUtil.getData(email);
        if (storedCode == null || storedCode.equals(code)) {

            result.isSuccess = false;
            result.resultCode = HttpStatus.BAD_REQUEST.value();
            result.message = "이메일 인증 코드 검증에 실패했습니다.";
        }
        // 인증 성공 시 Redis에 코드 삭제
        redisUtil.deleteData(email);
        result.message="이메일 인증 코드 검증에 성공했습니다.";
        result.isSuccess = true;
        result.jsonResult = true;
        return result;
    }

    /**
     *  아이디 사용 가능 여부 확인
     * @param userAccountId
     * @return JsonResultApiModel
     * @since 2025.07.27
     */
    public JsonResultApiModel isIdAvailable(String userAccountId) {

        logger.info("isIdAvailable ? " + userAccountId);
        JsonResultApiModel result = new JsonResultApiModel();
        boolean isIdValid = userRepository.existsByUserAccountId(userAccountId);
        if (isIdValid == false) {

            logger.info("아이디는 사용 가능합니다.");
            result.message = "아이디는 사용 가능합니다.";
            result.isSuccess = true;
            result.jsonResult = true;
        } else {

            logger.info("아이디는 사용 불가능합니다.");
            result.message = "아이디는 사용 불가능합니다.";
            result.isSuccess = false;
            result.jsonResult = false;
        }
        return result;
    }
}
