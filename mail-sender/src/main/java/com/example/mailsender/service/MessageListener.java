package com.example.mailsender.service;


import com.example.mailsender.dto.MessageDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageListener {

    private final ObjectMapper objectMapper;
    private final EmailService emailService;

    @KafkaListener(topics = "${kafka.topic.need-close-entry-topic}",
            groupId = "${spring.application.name}")
    public void listenTopicCloseEntry(String message) {
        try {
            MessageDto needCloseMessage = objectMapper.readValue(message, MessageDto.class);
            emailService.sendNeedCloseEntryMail(needCloseMessage);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @KafkaListener(topics = "${kafka.topic.need-open-entry-topic}",
            groupId = "${spring.application.name}")
    public void listenTopicOpenEntry(String message) {
        try {
            MessageDto needOpenMessage = objectMapper.readValue(message, MessageDto.class);
            emailService.sendNeedOpenEntryMail(needOpenMessage);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}