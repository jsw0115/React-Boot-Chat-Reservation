package com.example.reactdemo.db.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional // 메서드 전체를 하나의 트랜잭션으로 묶음
public class StatisticsService {
}
