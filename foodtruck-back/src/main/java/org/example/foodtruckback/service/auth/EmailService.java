package org.example.foodtruckback.service.auth;

import jakarta.validation.Valid;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.auth.mail.request.SendEmailRequestDto;

public interface EmailService {
    void sendHtmlEmail(String email, String subject, String html);
    void sendPasswordReset(String email, String url);

    ResponseDto<Void> sendEmail(@Valid SendEmailRequestDto request);

    void sendEmailChangeVerify(String email, String url);
}
