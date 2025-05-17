package com.example.reactdemo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

/**
 *  Security
 * */
@Configuration // 설정 클래스임을 명시
@EnableWebSecurity // Spring Security 필터를 Spring FilterChain에 등록
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true) // @Secured, @PreAuthorize 등의 애너테이션 기반 권한 설정을 사용 가능하게 함
public class SecurityConfig {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     *  비밀번호 암호화에 사용할 인코더(BCrypt 방식) 빈 등록
     */
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    /**
     *  보안 필터 체인 정의: HTTP 보안 설정
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable) // CSRF 보호 기능 비활성화 (예: H2 콘솔 사용 등을 위해)
                .formLogin(Customizer.withDefaults())  // 기본 로그인 페이지 사용 (커스터마이징 가능)
                .authorizeHttpRequests(authorizeRequest ->  // URL 경로별 접근 권한 설정
                        authorizeRequest
                                .requestMatchers(
                                        AntPathRequestMatcher.antMatcher("/auth/**")
                                ).authenticated() // "/auth/**" 경로는 인증된 사용자만 접근 가능
                                .requestMatchers(
                                        AntPathRequestMatcher.antMatcher("/h2-console/**")
                                ).permitAll() // H2 콘솔 경로는 누구나 접근 가능
                )
                .headers(
                        headersConfigurer -> // H2 콘솔을 iframe으로 띄우기 위해 sameOrigin 설정
                                headersConfigurer
                                        .frameOptions(
                                                HeadersConfigurer.FrameOptionsConfig::sameOrigin
                                        )
                );

        return http.build(); // 설정을 기반으로 SecurityFilterChain 객체 생성
    }

    /**
     * WebSecurityCustomizer: 정적 리소스를 보안 필터링 대상에서 제외
     * */
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {

        return (web) ->
            web
            .ignoring()
            .requestMatchers(
                    PathRequest.toStaticResources().atCommonLocations()
                    // /css/**, /js/**, /images/** 등의 정적 리소스는 필터링 제외
        );
    }
}

