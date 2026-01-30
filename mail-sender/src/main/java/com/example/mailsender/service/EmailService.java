package com.example.mailsender.service;

import com.example.mailsender.Integration.EmployeesClient;
import com.example.mailsender.config.MailConfig;
import com.example.mailsender.dto.EmployeeDto;
import com.example.mailsender.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final MailConfig config;
    private final EmployeesClient employeesClient;

    void sendNeedCloseEntryMail(MessageDto messageDto) {
        var employee = employeesClient.getEmployeeById(messageDto.keycloakId());
        SimpleMailMessage mail = getMailMessage(employee, "Вы забыли завершить смену");
        //      Раскомментировать для реальной отправки письма:
//        mailSender.send(mail);

        log.info("Сообщение отправлено пользователю {} на емэйл {} с текстом: \" {} \"",
                employee.getSurname(), employee.getEmail(), mail.getText());
    }

    void sendNeedOpenEntryMail(MessageDto messageDto) {
        var employee = employeesClient.getEmployeeById(messageDto.keycloakId());
        SimpleMailMessage mail = getMailMessage(employee, "Вы забыли начать смену");
        //      Раскомментировать для реальной отправки письма:
//        mailSender.send(mail);

        log.info("Сообщение отправлено пользователю {} на емэйл {} с текстом: \" {} \"",
                employee.getSurname(), employee.getEmail(), mail.getText());
    }

    private SimpleMailMessage getMailMessage(EmployeeDto employee, String messageToEmployee) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(employee.getEmail());
        mail.setSubject("Важное письмо от работодателя");
        mail.setText("Уважаемый " + employee.getSurname() + ", " + messageToEmployee);
        mail.setFrom(config.getUsername());
        return mail;
    }
}
