package com.example.reactdemo.web.apicontroller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 모든 컨트롤러에서 설정하는 Api Controller
 * 다른 컨트롤러에서 이를 상속받는다.
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")     // CORS 오류일 가능성 존재
public class BaseApiController {

}
