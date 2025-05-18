package com.example.reactdemo.web.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 *
 *
 * @since 2025.05.18
 * */
@Entity
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String userAccountId;
    private String username;
    @Column(nullable = false)
    private String password;
    private LocalDateTime createDt;
    private LocalDateTime updateDt;
    private Short useYN;
    private short role;
}
