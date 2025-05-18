package com.example.reactdemo.web.model.dto;

import com.example.reactdemo.enums.UserRole;
import com.example.reactdemo.web.model.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 *  UserDetails 상속받아 사용
 * @since 2025.05.18
 * */
public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    /**
     * 권한 목록 가져와 사용
     * @since 2025.05.18
     * */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of();
        return Collections.singletonList(new SimpleGrantedAuthority(
                UserRole.fromCode(user.getRole()).getRoleName())
        );
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUserAccountId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public User getUser() {
        return user;
    }

}
