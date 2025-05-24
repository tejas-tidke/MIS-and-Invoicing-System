package com.codeb.pdfgen;


import java.io.ByteArrayInputStream;
import java.util.Objects;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public void sendInvoiceEmail(String to, String subject, String text, byte[] attachment, String attachmentName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);
            
            if (Objects.nonNull(attachment)) {
                helper.addAttachment(attachmentName, () -> new ByteArrayInputStream(attachment));
            }
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
