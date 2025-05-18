package com.example.reactdemo.db.repository;

import com.example.reactdemo.web.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * User
 * @since 2025.05.17
 * */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserAccountId(String userAccountId);
    boolean existsByUserAccountId(String userAccountId);
}
