package com.example.reactdemo.web.apicontroller;

import com.example.reactdemo.db.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatsApiController {

    private final StatisticsService service;
}
