package com.example.reactdemo.util.security;

import com.example.reactdemo.db.repository.UserRepository;
import com.example.reactdemo.web.model.dto.user.CustomUserDetails;
import com.example.reactdemo.web.model.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;
import java.util.List;

@Component
public class JwtProvider {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final String secretKey;
    private final UserRepository userRepository;

    public JwtProvider(@Value("${jwt.secret}") String secretKey,
                       UserRepository userRepository) {
        this.secretKey = secretKey;
        this.userRepository = userRepository;
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", userDetails.getAuthorities().stream().findFirst().get().getAuthority())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1시간 유효
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        String username = getUsername(token);
        return new UsernamePasswordAuthenticationToken(username, "", List.of());
    }

    public String getUsername(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
//            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {

            logger.warn("Invalid JWT: {}", e.getMessage());
            return false;
        }
    }

    public UserDetails getUserDetails(String username) {
        User user = userRepository.findByUserAccountId(username).orElseThrow();
        return new CustomUserDetails(user);
    }
}
