package com.example.reactdemo.db.service;

import com.example.reactdemo.web.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
}
