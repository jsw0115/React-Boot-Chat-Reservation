package com.example.reactdemo.db.repository;

import com.example.reactdemo.web.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * User
 * @since 2025.05.17
 * */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserAccountId(String userAccountId);
}
