package com.example.reactdemo.db.service;

import com.example.reactdemo.db.repository.UserRepository;
import com.example.reactdemo.enums.UserRole;
import com.example.reactdemo.web.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * User 정보 관련 Service
 * @since 2025.05.17
 * */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * SpringSecurity에서 생성한 Bean 사용
     * @since 2025.05.17
     * */
    public UserService (PasswordEncoder encoder) {
        this.encoder = encoder;
    }

    /**
     * userAccountId로 User 찾기
     * @since 2025.05.17
     * */
    public UserDetails getUser(String userAccountId) {

        User user = userRepository.findByUserAccountId(userAccountId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        String encodedPassword = encoder.encode(user.getPassword());
        UserRole role = UserRole.fromCode(user.getRole());
        String roleName = role.name();

        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getUsername())
                .password(encodedPassword)
                .roles(roleName)
                .build();
    }
}
