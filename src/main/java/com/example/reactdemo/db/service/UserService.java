package com.example.reactdemo.db.service;

import com.example.reactdemo.db.repository.UserRepository;
import com.example.reactdemo.enums.UserRole;
import com.example.reactdemo.web.model.dto.CustomUserDetails;
import com.example.reactdemo.web.model.entity.User;
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

    /**
     *
     */
    public String register (User user) {

        if (userRepository.existsByUserAccountId(user.getUserAccountId())) {
            return "duplication";
        }
        user.setPassword(user.getPassword());
        userRepository.save(user);
        return "success";
    }

    /**
     *
     */
    public boolean login (String userAccountId, String password) {

        Optional<User> user = userRepository.findByUserAccountId(userAccountId);
        if (user.isPresent()) {

            return encoder.matches(password, user.get().getPassword());
        } else {
            return false;
        }
    }

    //    @Autowired
//    private UserRepository userRepository;
//    private final PasswordEncoder encoder;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

//    /**
//     * SpringSecurity에서 생성한 Bean 사용
//     * @since 2025.05.17
//     * */
//    public UserService (PasswordEncoder encoder) {
//        this.encoder = encoder;
//    }
//
//    /**
//     * userAccountId로 User 찾기
//     * @since 2025.05.17
//     *
//     * @param userAccountId
//     * @return UserDetails
//     * */
//    public UserDetails getUser(String userAccountId) {
//
//        logger.info("UserService, getUser");
//        User user = new User();
//        try {
//
//            user = userRepository.findByUserAccountId(userAccountId)
//                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//        } catch (Exception e) {
//
//            logger.error("error 발생");
//            throw new RuntimeException(e);
//        }
//        String encodedPassword = "";
//        if (user != null && user.getPassword() != null) {
//
//            logger.info("user.getPassword() ? " + user.getPassword());
//            encodedPassword = encoder.encode(user.getPassword());
//        } else {
//
//            logger.info("user.getPassword() ? " + 1111);
//            encodedPassword = encoder.encode("1111");
//        }
//        UserRole role = UserRole.fromCode(user.getRole());
//        String roleName = role.name();
//        logger.info("encodedPassword ? " + encodedPassword);
//        logger.info("roleName ? " + roleName);
//
//        return org.springframework.security.core.userdetails.User
//                .builder()
//                .username(user.getUsername())
//                .password(encodedPassword)
//                .roles(roleName)
//                .build();
//    }

//    /**
//     * user 정보 가져오기
//     * @since 2025.05.18
//     *
//     * @param userAccountId
//     * @throws UsernameNotFoundException
//     * @return UserDetails
//     * */
//    @Override
//    public UserDetails loadUserByUsername(String userAccountId) throws UsernameNotFoundException {
//
//        User user = userRepository.findByUserAccountId(userAccountId)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        return new CustomUserDetails(user);
//    }

    /**
     * user 정보 가져오기
     * @since 2025.05.18
     *
     * @param userAccountId
     * @throws UsernameNotFoundException
     * @return UserDetails
     * */
    /*
    @Override
    public UserDetails loadUserByUsername(String userAccountId) throws UsernameNotFoundException {

        logger.info("UserService, loadUserByUsername");
        Optional<User> user = Optional.of(new User());
        try {

            user = userRepository.findByUserAccountId(userAccountId);
        } catch (Exception e) {

            user = Optional.of(new User());
            logger.error("error 발생");
            throw new RuntimeException(e);
        }
        String encodedPassword = "";
        UserRole role = UserRole.fromCode((short)0);
        String roleName = role.name();
        encodedPassword = encoder.encode("1111");
        logger.info("user.getPassword() ? " + 1111);
        logger.info("109 Line encodedPassword ? " + encodedPassword);
        logger.info("roleName ? " + roleName);

        try {

            if (user.isPresent()) {

                User userEntity = new User();
                userEntity = user.get();
                encodedPassword = userEntity.getPassword();
                role = UserRole.fromCode(userEntity.getRole());
                roleName = role.name();
                logger.info("121 Line user.getPassword() ? " + userEntity.getPassword());
                logger.info("user.getRole() ? " + userEntity.getRole());
                logger.info("user. roleName ? " + roleName);
            } else {

                logger.error("else문 통해서 생성됨");
                encodedPassword = encoder.encode("1111");
                role = UserRole.fromCode((short)0);
                roleName = role.name();
                logger.info("before Password ? " + 1111);
                logger.info("131 Line encodedPassword ? " + encodedPassword);
                logger.info("roleName ? " + roleName);
            }
        } catch (Exception e) {

            encodedPassword = encoder.encode("1111");
            role = UserRole.fromCode((short)0);
            roleName = role.name();
            logger.info("before Password ? " + 1111);
            logger.info("encodedPassword ? " + encodedPassword);
            logger.info("roleName ? " + roleName);
            logger.error("Exception 발생");
            e.printStackTrace();
        }

        return org.springframework.security.core.userdetails.User
                .builder()
                .username(userAccountId)
                .password(encodedPassword)
                .roles(roleName)
                .build();
    }
    */
}
