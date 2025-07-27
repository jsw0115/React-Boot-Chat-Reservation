package com.example.reactdemo.util.helper;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class RedisUtil {

    private final StringRedisTemplate template;

    /**
     *
     */
    public String getData(String key) {

        return template.opsForValue().get(key);
    }

    /**
     *
     */
    public void setDataExpire(String key, String value, long durationSeconds) {

        Duration duration = Duration.ofSeconds(durationSeconds);
        template.opsForValue().set(key, value, duration);
    }

    /**
     *
     *
     */
    public void deleteData(String key) {

        template.delete(key);
    }
}
