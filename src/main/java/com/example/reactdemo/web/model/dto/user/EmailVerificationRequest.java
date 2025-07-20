package com.example.reactdemo.web.model.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 *
 */
@Data
public class EmailVerificationRequest {

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    private String email;

    // 인증 코드 (확인 요청 시 사용)
    private String vertificationCode;
}
