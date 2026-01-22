package org.example.foodtruckback.service.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.mail.request.SendEmailRequestDto;

public interface EmailService {
    void sendHtmlEmail(String email, String subject, String html);
    void sendPasswordReset(String email, String url);

    ResponseDto<Void> sendEmail(@Valid SendEmailRequestDto request);

    void sendEmailChangeVerify(String email, String url);
}
