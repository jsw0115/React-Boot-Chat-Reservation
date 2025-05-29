package com.example.reactdemo.util.config;

import com.example.reactdemo.db.service.CustomUserDetailsService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.annotation.web.configurers.SessionManagementConfigurer;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.io.IOException;

/**
 * SpringSecurity 설정 소스
 * @since 2025.05.18
 * */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 비밀번호 인코딩
     * */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * filterChain
     * @since 2025.05.18
     * */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)  // csrf :
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/", "/index.html", "/login", "/signup", "/login/**", "/signup/**",
                                "/static/**", "/css/**", "/js/**", "/h2-console/**", "/**",  "/api/account/**"
                        ).permitAll()
                        .requestMatchers("/auth/**").authenticated() // 이 부분도 문자열로!
                        .anyRequest().authenticated() // 나머지는 인증 필요
                )
                // API 전용 로그인 → 리다이렉트 방지
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(((request, response, authException) -> {

                            // 인증 실패 시, 401 응답
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"Unauthorized\"}");
                        }))
                )
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
                .formLogin(form -> form
                        .loginPage("/login")    // 커스텀 로그인 페이지
                        .loginProcessingUrl("/login")   // 로그인 처리 URL (POST)
                        .defaultSuccessUrl("/home", true)   // 로그인 성공 시, 이동할 url
                        .permitAll()
                        .failureHandler(new LoginFailHandler())
                ).logout((logout) -> logout
                        .logoutUrl("/logout")   // 로그아웃할 때, 사용될 url 
                        .logoutSuccessUrl("/login?logout")  // 로그아웃 성공 시, 이동하는 url
                        .invalidateHttpSession(true)    // 세션 무효화
                        .deleteCookies("JSESSIONID")
                ).sessionManagement(sessionManagement -> sessionManagement
                        .maximumSessions(1)     // 하나의 아이디에 대한 다중 로그인 허용 개수
                        .maxSessionsPreventsLogin(true)     // 다중 로그인 개수를 초과할 경우, 처리 방법 : true : 새로운 로그인 차단, false : 기존 세션 하나 삭제 
                ).sessionManagement((session) -> session
                        .sessionFixation(SessionManagementConfigurer.SessionFixationConfigurer::newSession)     // 세션 고정 보호 방식 : 
                        // sessionFixation.none : 로그인 시, 세션 정보 변경 X 
                        // sessionFixation.newSession : 로그인 시, 세션 새로 생성
                        // sessionFixation.changeSessionId : 로그인 시, 동일한 세션에 대한 ID 변경
                );
        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }

    /**
     * 최신 방식: AuthenticationConfiguration을 통한 등록
     * */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * React CORS 설정
     * @since 2025.05.18
     * */
    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");   // React 서버
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }

    /**
     * Login 실패
     * @since 20250526
     */
    public class LoginFailHandler extends SimpleUrlAuthenticationFailureHandler {

        @Override
        public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                            AuthenticationException exception) throws IOException, ServletException {

            logger.error("LoginFailHandler");
            logger.error(exception.getMessage());

            super.onAuthenticationFailure(request, response, exception);
        }
    }
}
