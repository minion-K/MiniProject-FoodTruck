package org.example.foodtruckback.service.auth;

public interface EmailService {
    void sendHtmlEmail(String email, String subject, String html);
    void sendPasswordReset(String email, String url);
}
