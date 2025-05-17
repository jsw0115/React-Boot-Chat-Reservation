package com.example.reactdemo.web.model.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ChatRoom {

    private String roomId;  // 고유한 Random UUID를 생성
    private String name;    // 매개변수를 통해 지정하여 생성

    public static ChatRoom create(String name) {

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.roomId = UUID.randomUUID().toString();
        return chatRoom;
    }
}
