package com.example.reactdemo.db.repository;

import com.example.reactdemo.web.model.entity.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findByToken(String token);
    Optional<EmailVerificationToken> findByEmail(String email); // 특정 이메일에 대한 유효한 토큰 확인
}
