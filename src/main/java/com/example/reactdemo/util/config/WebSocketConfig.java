package com.example.reactdemo.util.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

/**
 * Springboot + STOMP를 활용한 채팅 구현
 * */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final Logger logger = LoggerFactory. getLogger(this.getClass());

    /**
     *  세션 인증 정보 연결
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {

        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

                // CONNECT 프레임은 인증 제외
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    return message;
                }

                // 인증 정보 확인
                logger.info("accessor.getUser().getName() ? " + accessor.getUser().getName());
                if (!(accessor.getUser() instanceof Authentication authentication)) {
                    logger.error("❌ 인증 정보 없음 → 메시지 차단");
                    throw new AccessDeniedException("로그인한 사용자만 사용할 수 있습니다.");
                }

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                    if (auth == null || !auth.isAuthenticated()) {
                        throw new AccessDeniedException("인증된 사용자만 WebSocket 사용 가능");
                    }
                    accessor.setUser(auth); // ✅ 사용자 정보를 WebSocket 세션에 연결
                }

                // 권한 검사 (선택 사항)
                /*
                boolean isAdmin = authentication.getAuthorities().stream()
                        .anyMatch(auth -> "ROLE_ADMIN".equals(auth.getAuthority()));

                if (!isAdmin) {
                    throw new AccessDeniedException("관리자만 접근할 수 있습니다.");
                }
                */

                    // 필수 헤더 확인 (선택 사항, 테스트 시 제거 권장)
                /*
                String requiredHeader = accessor.getFirstNativeHeader("X-Required-Header");
                if (requiredHeader == null) {
                    throw new IllegalArgumentException("필수 헤더 누락됨");
                }
                */

                return message;
            }
        });
    }

    /**
     *
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
                .addEndpoint("/ws") // WebSocket 연결 경로
                .setAllowedOriginPatterns("*")
                .addInterceptors(new HttpSessionHandshakeInterceptor())
                .withSockJS(); // SockJS fallback 지원
    }

    /**
     *
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        registry.enableSimpleBroker("/topic");  // 구독용 주소 (브로커)
        registry.setApplicationDestinationPrefixes("/pub");     // 메시지 송신용 주소 (컨트롤러로 전달)
    }
}
