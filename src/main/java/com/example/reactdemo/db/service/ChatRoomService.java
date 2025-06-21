package com.example.reactdemo.db.service;

import com.example.reactdemo.db.repository.ChatRoomRepository;
import com.example.reactdemo.web.model.dto.Chat.ChatRoomDto;
import com.example.reactdemo.web.model.entity.ChatRoom;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatRoomService {

    private final ChatRoomRepository repository;

    public ChatRoomService(ChatRoomRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ChatRoomDto createRoom(String name) {

        ChatRoom room = repository.save(new ChatRoom(name));
        return new ChatRoomDto(room);
    }

    @Transactional(readOnly = true)
    public ChatRoomDto getRoom(Long id) {
        ChatRoom room = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room Not Found"));
        return new ChatRoomDto(room);
    }

    @Transactional(readOnly = true)
    public List<ChatRoomDto> getAllRooms(){
        return repository.findAll().stream()
                .map(ChatRoomDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ChatRoom getRoomEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room Not Found"));
    }
}
