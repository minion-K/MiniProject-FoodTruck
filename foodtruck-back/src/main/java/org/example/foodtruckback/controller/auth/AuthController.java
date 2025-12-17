package org.example.foodtruckback.controller.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.auth.AuthApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.auth.request.*;
import org.example.foodtruckback.dto.auth.response.FindIdResponseDto;
import org.example.foodtruckback.dto.auth.response.LoginResponseDto;
import org.example.foodtruckback.dto.auth.response.PasswordVerifyResponseDto;
import org.example.foodtruckback.dto.auth.response.SignupResponseDto;
import org.example.foodtruckback.dto.mail.request.SendEmailRequestDto;
import org.example.foodtruckback.service.auth.AuthService;
import org.example.foodtruckback.service.auth.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(AuthApi.ROOT)
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final EmailService emailService;

    //회원 가입
    @PostMapping(AuthApi.SIGNUP)
    public ResponseEntity<ResponseDto<SignupResponseDto>> signup(
            @Valid @RequestBody SignupRequestDto request
    ) {
        ResponseDto<SignupResponseDto> result = authService.sign(request);

        return ResponseEntity.status(result.getStatus()).body(result);
    }

    // 로그인
    @PostMapping(AuthApi.LOGIN)
    public ResponseEntity<ResponseDto<LoginResponseDto>> login(
            @Valid @RequestBody LoginRequestDto request,
            HttpServletResponse response
    ) {
        ResponseDto<LoginResponseDto> result = authService.login(request, response);

        return ResponseEntity.status(response.getStatus()).body(result);
    }

    // 로그아웃
    @PostMapping(AuthApi.LOGOUT)
    public ResponseEntity<ResponseDto<Void>> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        ResponseDto<Void> result = authService.logout(request, response);

        return ResponseEntity.status(response.getStatus()).body(result);
    }

    // 아이디 찾기
    @GetMapping(AuthApi.LOGINID_FIND)
    public ResponseEntity<ResponseDto<FindIdResponseDto>> findId(
            @Valid @RequestBody FindIdRequestDto request
    ) {
        ResponseDto<FindIdResponseDto> response = authService.findId(request);

        return ResponseEntity.ok().body(response);
    }

    // 비밀번호 재설정
    @PostMapping(AuthApi.PASSWORD_RESET)
    public ResponseEntity<ResponseDto<Void>> resetPassword(
            @Valid @RequestBody PasswordResetRequest request
    ) {
        ResponseDto<Void> response = authService.resetPassword(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 토큰 재발급
    @PostMapping(AuthApi.REFRESH)
    public ResponseEntity<ResponseDto<LoginResponseDto>> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        ResponseDto<LoginResponseDto> result = authService.refreshAccessToken(request, response);

        return ResponseEntity.status(response.getStatus()).body(result);
    }

    // 비밀번호 재설정 토큰
    @GetMapping(AuthApi.PASSWORD_VERIFY)
    public ResponseEntity<ResponseDto<PasswordVerifyResponseDto>> verifyPasswordToken(
            @RequestParam("token") String token
    ) {
        ResponseDto<PasswordVerifyResponseDto> result = authService.verifyPasswordToken(token);

        return ResponseEntity.status(result.getStatus()).body(result);
    }

    // 이메일 전송
    @PostMapping("/send-email")
    public ResponseEntity<ResponseDto<Void>> sendEmail(
            @Valid @RequestBody SendEmailRequestDto request
    ) {
        ResponseDto<Void> result = emailService.sendEmail(request);

        return ResponseEntity.status(result.getStatus()).body(result);
    }

    // 이메일 인증
    @GetMapping("/email/verify")
    public ResponseEntity<ResponseDto<Void>> verifyEmail(@RequestParam String token) {
        ResponseDto<Void> result = authService.verifyEmail(token);

        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
