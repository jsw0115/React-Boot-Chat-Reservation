package com.example.reactdemo.util.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 비밀번호 암호화 관련 설정
 * @since 2025.05.24
 * */
public class PasswordEncryptor {

    private static final PasswordEncoder encoder = new BCryptPasswordEncoder();

    /**
     * 패스워드 인코딩
     * @param passwd
     * @return result
     * @since 2025.05.24
     * */
    public static String encode(String passwd) {

        return encoder.encode(passwd);
    }

    /**
     * 입력한 패스워드와 인코딩된 패스워드 비교
     * @param rawPassword
     * @param hashedPassword
     * @return
     * @since 2025.05.24
     */
    public static boolean matches(String rawPassword, String hashedPassword) {
        return encoder.matches(rawPassword, hashedPassword);
    }
}
