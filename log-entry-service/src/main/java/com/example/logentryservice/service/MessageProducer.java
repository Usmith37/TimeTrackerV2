package com.example.logentryservice.service;

import com.example.logentryservice.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topic.need-close-entry-topic}")
    private String needCloseTopic;

    @Value("${kafka.topic.need-open-entry-topic}")
    private String needOpenTopic;

    public void sendNeedClose(MessageDto message) {
        kafkaTemplate.send(needCloseTopic, message);
//        System.out.println("✅ Sent to Kafka: " + message.text());
    }

    public void sendNeedOpen(MessageDto message) {
        kafkaTemplate.send(needOpenTopic, message);
//        System.out.println("✅ Sent to Kafka: " + message.text());
    }
}
