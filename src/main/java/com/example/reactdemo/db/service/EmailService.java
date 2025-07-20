package com.example.reactdemo.db.service;

import com.example.reactdemo.web.model.models.JsonResultApiModel;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // Spring Mail Sender
//    @Autowired
    private JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Bean
    public JavaMailSenderImpl mailSender() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();

        javaMailSender.setProtocol("smtp");
        javaMailSender.setHost("127.0.0.1");
        javaMailSender.setPort(25);

        return javaMailSender;
    }

    /**
     *
     *
     */
    public JsonResultApiModel sendEmail (String to, String subject, String text) {

        JsonResultApiModel result = new JsonResultApiModel();

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom("");

            mailSender.send(message);

            result.jsonResult = message;
            result.isSuccess = true;
            result.message = "SUCCESS";

        } catch (MailException e) {

            result.isSuccess = false;
            result.message = "FAIL";

            logger.error("Failed to Send email to " + to + " : " + e);
            throw new RuntimeException("이메일 발송 실패 : " + e.getMessage());
        }

        return result;
    }
}
