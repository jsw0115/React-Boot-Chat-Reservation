package com.example.reactdemo.web.model.dto.Chat;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class Chat {

    // 메시지 타입
    public enum MessageType {
        TALK, JOIN, IMG
    }

    private MessageType type;
    private String roomId;
    private String sender;
    private String message;
    private Date time;
}
