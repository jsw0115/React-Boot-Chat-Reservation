package com.example.reactdemo.util.helper;

import java.sql.Timestamp;
import java.time.Instant;

/**
 * UTC 시간대와 관련된 Helper 소스
 * @since 2025.05.24
 * */
public class UtcHelper {

    /**
     * 현재 시간 UTC 시간으로 가져오기
     * @since 2025.05.24
     * */
    public static Timestamp getUtcNow() {

        Instant nowUtc = Instant.now();
        return Timestamp.from(nowUtc);
    }
}
