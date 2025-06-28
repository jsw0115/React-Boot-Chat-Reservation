package com.example.reactdemo.util.security;

import com.example.reactdemo.db.service.UserService;
import com.example.reactdemo.web.model.dto.user.CustomUserDetails;
import com.example.reactdemo.web.model.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;

public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final UserService userService;

    public OAuth2SuccessHandler(JwtProvider jwtProvider, UserService userService) {
        this.jwtProvider = jwtProvider;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        User user = userService.loadOrRegisterOAuthUser(email);

        String token = jwtProvider.generateToken(new CustomUserDetails(user));
        response.sendRedirect("http://localhost:3000/oauth2/redirect?token=" + token);
    }
}
