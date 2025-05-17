package com.example.reactdemo.web.model.dto;

/**
 * */
public class ChatMessage {

    public enum MessageType {
        ENTER, TALK, EXIT, MATCH, MATCH_REQUEST;
    }

    private MessageType type;
    private String roomId;
    private String sender;
    private String message;
}
