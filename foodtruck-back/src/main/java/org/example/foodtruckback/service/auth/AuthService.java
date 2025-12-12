package org.example.foodtruckback.service.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.auth.request.FindIdRequestDto;
import org.example.foodtruckback.dto.auth.request.LoginRequestDto;
import org.example.foodtruckback.dto.auth.request.PasswordResetRequest;
import org.example.foodtruckback.dto.auth.request.SignupRequestDto;
import org.example.foodtruckback.dto.auth.response.FindIdResponseDto;
import org.example.foodtruckback.dto.auth.response.LoginResponseDto;
import org.example.foodtruckback.dto.auth.response.PasswordVerifyResponseDto;
import org.example.foodtruckback.dto.auth.response.SignupResponseDto;

public interface AuthService {
    ResponseDto<SignupResponseDto> sign(@Valid SignupRequestDto request);
    ResponseDto<LoginResponseDto> login(@Valid LoginRequestDto request, HttpServletResponse response);
    ResponseDto<Void> logout(HttpServletRequest request, HttpServletResponse response);

    ResponseDto<FindIdResponseDto> findId(@Valid FindIdRequestDto request);
    ResponseDto<Void> resetPassword(@Valid PasswordResetRequest request);

    ResponseDto<LoginResponseDto> refreshAccessToken(HttpServletRequest request, HttpServletResponse response);
    ResponseDto<PasswordVerifyResponseDto> verifyPasswordToken(String token);

    ResponseDto<Void> sendPasswordResetEmail(String email);
}
