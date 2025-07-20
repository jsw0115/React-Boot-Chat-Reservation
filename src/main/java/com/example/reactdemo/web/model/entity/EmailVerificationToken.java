package com.example.reactdemo.web.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false, unique = true)
    private String email; // 어떤 이메일에 대한 토큰인지

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    // 인증 여부 (한번 사용되면 무효화)
    private boolean used;

    public EmailVerificationToken(String token, String email, LocalDateTime expiryDate) {
        this.token = token;
        this.email = email;
        this.expiryDate = expiryDate;
        this.used = false;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}
