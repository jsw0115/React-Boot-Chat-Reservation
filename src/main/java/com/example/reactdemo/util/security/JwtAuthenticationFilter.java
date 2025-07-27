package com.example.reactdemo.util.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

//@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {


        String path = request.getRequestURI();

        // JWT 인증이 필요 없는 경로 리스트
        if (path.startsWith("/signup") || path.startsWith("/login") ||
                path.startsWith("/oauth2") || path.startsWith("/api/account") ||
                path.startsWith("/static") || path.startsWith("/ws")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = extractToken(request);

        String authHeader = request.getHeader("Authorization");
        logger.info("Request URI: " + request.getRequestURI());
        logger.info("Authorization Header: " + authHeader);

        if (token != null && jwtProvider.validateToken(token)) {
            String username = jwtProvider.getUsername(token);
            logger.info("JwtAuthenticationFilter username ? " + username);

            var userDetails = jwtProvider.getUserDetails(username);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {

            logger.warn("JWT 토큰 유효성 실패 또는 토큰 없음: {}");
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {

        String bearerToken = request.getHeader("Authorization");
        logger.info("bearerToken ? " + bearerToken);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

}
