package com.example.reactdemo.web.controller;

import com.example.reactdemo.db.service.ChatMessageService;
import com.example.reactdemo.db.service.ChatRoomService;
import com.example.reactdemo.web.model.dto.Chat.ChatMessageDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 *
 */
@Controller("/chat")
public class ChatController {

    private final SimpMessagingTemplate template;
    private final ChatMessageService messageService;
    private final ChatRoomService roomService;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     *
     */
    public ChatController(SimpMessagingTemplate template, ChatMessageService messageService, ChatRoomService roomService) {
        this.template = template;
        this.messageService = messageService;
        this.roomService = roomService;
    }

    /**
     *
     */
    @MessageMapping("/chat")              // 클라이언트 → /pub/chat 으로 전송
    @SendTo("/topic/messages")            // 구독자에게 브로드캐스트 → /topic/messages
    public String handleChat(String message) {
        return message; // 받은 메시지를 그대로 반환 (JSON이면 객체로 처리 가능)
    }

    /**
     *
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageDto messageDto, Principal principal) {
        if (principal == null) {
            throw new AccessDeniedException("인증된 사용자만 채팅 가능합니다.");
        }
        String username = principal.getName();
        logger.info("userName ? "+ username);

        // 서비스에 DTO와 principal만 전달
        ChatMessageDto savedMessageDto = messageService.saveMessage(messageDto, principal.getName());

        template.convertAndSend("/topic/chat/" + savedMessageDto.getId(), messageDto);
    }

    /**
     *
     */
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessageDto messageDto, Principal principal) {

        if (principal == null) {
            throw new AccessDeniedException("로그인이 필요합니다.");
        }

        // 서비스에 DTO와 principal name만 전달
        ChatMessageDto savedMessageDto = messageService.addUserToRoom(messageDto, principal.getName());

        template.convertAndSend("/topic/chat/" + savedMessageDto.getId(), savedMessageDto);
    }
}
