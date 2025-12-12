package org.example.foodtruckback.controller.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.auth.AuthApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.auth.request.FindIdRequestDto;
import org.example.foodtruckback.dto.auth.request.LoginRequestDto;
import org.example.foodtruckback.dto.auth.request.PasswordResetRequest;
import org.example.foodtruckback.dto.auth.request.SignupRequestDto;
import org.example.foodtruckback.dto.auth.response.FindIdResponseDto;
import org.example.foodtruckback.dto.auth.response.LoginResponseDto;
import org.example.foodtruckback.dto.auth.response.PasswordVerifyResponseDto;
import org.example.foodtruckback.dto.auth.response.SignupResponseDto;
import org.example.foodtruckback.service.auth.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(AuthApi.ROOT)
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

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


}
