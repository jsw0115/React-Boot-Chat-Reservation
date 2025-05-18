package com.example.reactdemo.db.service;

import com.example.reactdemo.db.repository.UserRepository;
import com.example.reactdemo.enums.UserRole;
import com.example.reactdemo.web.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService  implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

//    /**
//     * SpringSecurity에서 생성한 Bean 사용
//     * @since 2025.05.17
//     * */
//    public CustomUserDetailsService (UserRepository userRepository, PasswordEncoder encoder) {
//        this.userRepository = userRepository;
//        this.encoder = encoder;
//    }

    /**
     *
     * */
    @Override
    public UserDetails loadUserByUsername(String userAccountId) throws UsernameNotFoundException {
        // 사용자 조회
        User user = userRepository.findByUserAccountId(userAccountId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userAccountId));

        // 권한(role)을 문자열로 가져오기 (ex: "USER", "ADMIN")
        String role =  UserRole.fromCode(user.getRole()).getRoleName(); // ex: "USER" → ROLE_USER로 자동 처리됨

        boolean match = passwordEncoder.matches("1111", user.getPassword()); // 테스트용
        logger.info("비밀번호 매치 여부: " + match);

        logger.info("role ? " + role);
        logger.info("user.getUsername() ? " + user.getUsername());
        logger.info("user.getPassword() ? " + user.getPassword());

        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getUserAccountId())
                .password(user.getPassword()) // 암호화된 비밀번호!
                .roles(role) // 자동으로 ROLE_ 접두어 붙음
                .build();
    }
}
