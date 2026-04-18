package org.example.foodtruckback.controller.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.auth.AuthApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.auth.mail.request.ResetPasswordEmailRequestDto;
import org.example.foodtruckback.dto.auth.request.*;
import org.example.foodtruckback.dto.auth.response.FindIdResponseDto;
import org.example.foodtruckback.dto.auth.response.LoginResponseDto;
import org.example.foodtruckback.dto.auth.response.PasswordVerifyResponseDto;
import org.example.foodtruckback.dto.auth.response.SignupResponseDto;
import org.example.foodtruckback.dto.auth.mail.request.SendEmailRequestDto;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.auth.AuthService;
import org.example.foodtruckback.service.auth.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(AuthApi.ROOT)
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final EmailService emailService;

    @PostMapping(AuthApi.SIGNUP)
    public ResponseEntity<ResponseDto<SignupResponseDto>> signup(
            @Valid @RequestBody SignupRequestDto request
    ) {
        ResponseDto<SignupResponseDto> response = authService.sign(request);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping(AuthApi.LOGIN)
    public ResponseEntity<ResponseDto<LoginResponseDto>> login(
            @Valid @RequestBody LoginRequestDto request,
            HttpServletResponse response
    ) {
        ResponseDto<LoginResponseDto> result = authService.login(request, response);

        return ResponseEntity.status(response.getStatus()).body(result);
    }

    @PostMapping(AuthApi.LOGOUT)
    public ResponseEntity<ResponseDto<Void>> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        ResponseDto<Void> result = authService.logout(request, response);

        return ResponseEntity.status(response.getStatus()).body(result);
    }

    @PostMapping(AuthApi.FIND_ID)
    public ResponseEntity<ResponseDto<FindIdResponseDto>> findId(
            @Valid @RequestBody FindIdRequestDto request
    ) {
        ResponseDto<FindIdResponseDto> response = authService.findId(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping(AuthApi.PASSWORD_RESET_MAIL)
    public ResponseEntity<ResponseDto<Void>> sendPasswordResetEmail(
        @Valid @RequestBody ResetPasswordEmailRequestDto request
    ) {
        ResponseDto<Void> response = authService.sendPasswordResetEmail(request);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping(AuthApi.PASSWORD_RESET)
    public ResponseEntity<ResponseDto<Void>> resetPassword(
            @Valid @RequestBody PasswordResetRequest request
    ) {
        ResponseDto<Void> response = authService.resetPassword(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping(AuthApi.REFRESH)
    public ResponseEntity<ResponseDto<LoginResponseDto>> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        ResponseDto<LoginResponseDto> result = authService.refreshAccessToken(request, response);

        return ResponseEntity.status(response.getStatus()).body(result);
    }

    @GetMapping(AuthApi.PASSWORD_VERIFY)
    public ResponseEntity<ResponseDto<PasswordVerifyResponseDto>> verifyPasswordToken(
            @RequestParam("token") String token
    ) {
        ResponseDto<PasswordVerifyResponseDto> response = authService.verifyPasswordToken(token);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping(AuthApi.SEND_EMAIL)
    public ResponseEntity<ResponseDto<Void>> sendEmail(
            @Valid @RequestBody SendEmailRequestDto request
    ) {
        ResponseDto<Void> response = emailService.sendEmail(request);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping(AuthApi.VERIFY)
    public ResponseEntity<ResponseDto<Void>> verifyEmail(
            @RequestParam String token
    ) {
        ResponseDto<Void> response = authService.verifyEmail(token);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping(AuthApi.CHANGE_EMAIL)
    public ResponseEntity<ResponseDto<Void>> sendEmailChangeVerify(
            @RequestBody @Valid SendEmailRequestDto request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ResponseDto<Void> response = authService.sendEmailChangeVerify(request.email(), principal);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping(AuthApi.EMAIL_CHANGE_CONFIRM)
    public ResponseEntity<ResponseDto<Void>> confirmEmailChange(
            @RequestParam String token
    ) {
        ResponseDto<Void> response = authService.confirmEmailChange(token);

        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
