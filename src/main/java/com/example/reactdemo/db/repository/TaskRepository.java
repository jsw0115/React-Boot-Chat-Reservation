package com.example.reactdemo.db.repository;

import com.example.reactdemo.web.model.entity.routine.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
