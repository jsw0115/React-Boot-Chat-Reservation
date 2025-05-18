package com.example.reactdemo.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RestController("/Test")
public class TestContoller {

    private final Logger logger = LoggerFactory. getLogger(this.getClass());
    /*
    @GetMapping("/")
    public String helloworld() {
        return "hello, world";
    }

    @GetMapping("/api/test")
    public String hello() {
        return "안녕하세요 백엔드입니다.";
    }
    */

    @GetMapping
    public ResponseEntity<String> test() {

        Random random = new Random();

        return ResponseEntity.ok("" + random.nextInt());
    }

    @GetMapping("/")
    public String testIndex() {

        logger.info("testIndex Page");
        return "/";
    }
}
