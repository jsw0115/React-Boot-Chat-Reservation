package com.example.reactdemo.web.model.dto.Chat;

import com.example.reactdemo.web.model.entity.ChatRoom;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class ChatRoomDto {

    private Long id;
    private String name;
    private List<ChatMessageDto> messages;

    public ChatRoomDto(ChatRoom entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        // 메시지 리스트가 null이 아니면 DTO로 변환
        this.messages = entity.getMessages() == null ? null :
                entity.getMessages().stream()
                        .map(ChatMessageDto::new)
                        .collect(Collectors.toList());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ChatMessageDto> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessageDto> messages) {
        this.messages = messages;
    }
}
