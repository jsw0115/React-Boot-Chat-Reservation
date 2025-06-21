package com.example.reactdemo.db.service;

import com.example.reactdemo.db.repository.ChatRoomRepository;
import com.example.reactdemo.web.model.entity.ChatRoom;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatRoomRepository repository;

    public ChatService(ChatRoomRepository repository) {
        this.repository = repository;
    }

    public ChatRoom chatRoom(String name) {
        return repository.save(new ChatRoom(name));
    }
}
