package com.example.reactdemo.web.apicontroller;

import com.example.reactdemo.db.service.ChatMessageService;
import com.example.reactdemo.db.service.ChatRoomService;
import com.example.reactdemo.web.model.dto.Chat.ChatMessageDto;
import com.example.reactdemo.web.model.dto.Chat.ChatRoomDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")     // CORS 오류일 가능성 존재
@RequestMapping(("/api/chat"))
public class ChatApiController {

    private final Logger logger = LoggerFactory. getLogger(this.getClass());
    private final ChatMessageService messageService;
    private final ChatRoomService roomService;

    public ChatApiController(ChatMessageService messageService, ChatRoomService roomService) {

        this.messageService = messageService;
        this.roomService = roomService;
    }

    @GetMapping("/rooms")
    public List<ChatRoomDto> getRooms() {
        logger.info("ChatApiController, getRooms");
        return roomService.getAllRooms();
    }

    @PostMapping("/createRoom")
    public ChatRoomDto createRoom(@RequestBody Map<String, String> params) {
        return roomService.createRoom(params.get("name"));
    }

    @GetMapping("/{roomId}/messages")
    public List<ChatMessageDto> getMessages(@PathVariable Long roomId) {

        logger.info("messages");
        ChatRoomDto roomDto = roomService.getRoom(roomId);
        return roomDto.getMessages();
    }
}
