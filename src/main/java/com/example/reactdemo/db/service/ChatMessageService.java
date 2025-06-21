package com.example.reactdemo.db.service;

import com.example.reactdemo.db.repository.ChatMessageRepository;
import com.example.reactdemo.db.repository.ChatRoomRepository;
import com.example.reactdemo.enums.MessageType;
import com.example.reactdemo.web.model.dto.Chat.ChatMessageDto;
import com.example.reactdemo.web.model.entity.ChatMessage;
import com.example.reactdemo.web.model.entity.ChatRoom;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatMessageService {

    private final ChatMessageRepository repository;
    private final ChatRoomRepository chatRoomRepository;

    public ChatMessageService(ChatMessageRepository repository,
                              ChatRoomRepository chatRoomRepository) {
        this.repository = repository;
        this.chatRoomRepository = chatRoomRepository;
    }
    /*
    public ChatMessage save(ChatMessageDto messageDto) {
        return repository.save(message);
    }*/

    public List<ChatMessage> getMessagesByRoom(ChatRoom room) {
        return repository.findByChatRoomOrderByUpdateDtAsc(room);
    }
    @Transactional
    public ChatMessageDto saveMessage(ChatMessageDto messageDto, String sender) {
        // 1. 엔티티 조회
        ChatRoom chatRoom = chatRoomRepository.findById(messageDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Room Not Found"));

        // 2. 엔티티 생성 및 저장
        ChatMessage message = new ChatMessage();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(messageDto.getContent());
        message.setCreateDt(LocalDateTime.now());

        ChatMessage saved = repository.save(message);

        // 3. 엔티티 → DTO 변환 후 반환
        return new ChatMessageDto(saved);
    }

    /**
     *
     */
    public ChatMessageDto addUserToRoom(ChatMessageDto messageDto, String sender) {
        // 1. 채팅방 엔티티 조회
        ChatRoom chatRoom = chatRoomRepository.findById(messageDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Room Not Found"));

        // 2. 메시지 엔티티 생성 및 저장
        ChatMessage message = new ChatMessage();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setType(MessageType.JOIN);
        message.setContent(sender + "님이 입장했습니다.");
        message.setCreateDt(LocalDateTime.now());

        ChatMessage saved = repository.save(message);

        // 3. 엔티티 → DTO 변환
        return new ChatMessageDto(saved);
    }
}
