package com.example.reactdemo.web.apicontroller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 사용자와 관련된 정보를 가져오는 ApiController
 * @since 2025.08.24
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")     // CORS 오류일 가능성 존재
@RequestMapping(("/api/user"))
public class UserApiController {

}
