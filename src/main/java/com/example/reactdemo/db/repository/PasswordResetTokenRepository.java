package com.example.reactdemo.db.repository;

import com.example.reactdemo.web.model.entity.PasswordResetToken;
import com.example.reactdemo.web.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);
    // 특정 유저에 대한 유효한 토큰을 찾을 때 (중복 발행 방지)
    Optional<PasswordResetToken> findByUserAndUsedFalse(User user);
}
