package com.example.reactdemo.util.helper;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

/**
 * Timestamp 형식으로 변경
 * @since 2025.05.24
 * */
public class DateTimeFormatHelper {

    /**
     * String을 Timestamp 형태로 변경
     * @param date
     * @return
     * @since 2025.08.24
     * */
    public static LocalDateTime formatStringToLocalDateTime(String date, String format) {

        LocalDateTime result = null;

        try {

            result = LocalDateTime.parse(date, DateTimeFormatter.ofPattern(format));
        } catch (Exception e) {

            result = null;
        }

        return result;
    }

    /**
     * String을 Timestamp 형태로 변경
     * @param dateTime
     * @param format
     * @return
     * @since 2025.08.24
     * */
    public static Timestamp formatStringToTimestamp(String dateTime, String format) {

        Timestamp result = null;
        try {

            Date date = new SimpleDateFormat(format).parse(dateTime);
            result = new Timestamp(date.getTime());
        } catch (Exception e) {

            result = null;
        }

        return result;
    }
}
