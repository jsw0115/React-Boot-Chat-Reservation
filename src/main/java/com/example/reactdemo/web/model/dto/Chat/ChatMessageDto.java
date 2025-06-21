package com.example.reactdemo.web.model.dto.Chat;

import com.example.reactdemo.web.model.entity.ChatMessage;

/**
 * */
public class ChatMessageDto {

    private Long id;
    private String sender;
    private String content;
    private String createdDt;

    public ChatMessageDto(ChatMessage entity) {
        this.id = entity.getId();
        this.sender = entity.getSender();
        this.content = entity.getContent();
        this.createdDt = entity.getCreateDt().toString();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreatedDt() {
        return createdDt;
    }

    public void setCreatedDt(String createdDt) {
        this.createdDt = createdDt;
    }
}
