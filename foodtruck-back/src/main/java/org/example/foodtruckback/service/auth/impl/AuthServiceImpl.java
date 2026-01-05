package org.example.foodtruckback.service.auth.impl;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.common.enums.UserStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.auth.request.FindIdRequestDto;
import org.example.foodtruckback.dto.auth.request.LoginRequestDto;
import org.example.foodtruckback.dto.auth.request.PasswordResetRequest;
import org.example.foodtruckback.dto.auth.request.SignupRequestDto;
import org.example.foodtruckback.dto.auth.response.FindIdResponseDto;
import org.example.foodtruckback.dto.auth.response.LoginResponseDto;
import org.example.foodtruckback.dto.auth.response.PasswordVerifyResponseDto;
import org.example.foodtruckback.dto.auth.response.SignupResponseDto;
import org.example.foodtruckback.entity.auth.RefreshToken;
import org.example.foodtruckback.entity.user.Role;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.auth.RefreshTokenRepository;
import org.example.foodtruckback.repository.user.RoleRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.provider.JwtProvider;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.security.user.UserPrincipalMapper;
import org.example.foodtruckback.security.util.CookieUtils;
import org.example.foodtruckback.service.auth.AuthService;
import org.example.foodtruckback.service.auth.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserPrincipalMapper userPrincipalMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final EmailService emailService;

    private static final String REFRESH_TOKEN = "refreshToken";

    // 회원 가입
    @Override
    @Transactional
    public ResponseDto<SignupResponseDto> sign(SignupRequestDto request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if(user.getStatus() == UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }
        if(!user.isVerified()) {
            throw new BusinessException(ErrorCode.EMAIL_NOT_VERIFIED);
        }
        if (userRepository.findByLoginId(request.loginId()).isPresent()) {
            throw new BusinessException(ErrorCode.DUPLICATE_USER);
        }
        if (!request.password().equals(request.confirmPassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_CONFIRM_MISMATCH);
        }

        user.completeSignup(
                request.name(),
                request.loginId(),
                passwordEncoder.encode(request.password()),
                request.phone()
        );

        Role defaultRole = roleRepository.getReferenceById(RoleType.USER);
        user.addRole(defaultRole);

        userRepository.save(user);

        return ResponseDto.success("회원가입이 완료되었습니다.", SignupResponseDto.from(user));
    }

    // 로그인
    @Override
    @Transactional
    public ResponseDto<LoginResponseDto> login(LoginRequestDto request, HttpServletResponse response) {
        try {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    request.loginId(), request.password()
            );

            Authentication authentication = authenticationManager.authenticate(authToken);

            Set<String> roles = authentication.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(java.util.stream.Collectors.toSet());

            String loginId = authentication.getName();

            User user = userRepository.findByLoginId(loginId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

            // Access/Refresh Token 생성
            String accessToken = jwtProvider.generateAccessToken(user.getId(), loginId, roles);
            String refreshToken = jwtProvider.generateRefreshToken(user.getId(), loginId, roles);

            long accessExpiresIn = jwtProvider.getRemainingMillis(accessToken);
            long refreshRemaining = jwtProvider.getRemainingMillis(refreshToken);

            if(refreshRemaining <= 0) {
                throw new BusinessException(ErrorCode.TOKEN_INVALID);
            }

            Instant refreshExpiry = Instant.now().plusMillis(refreshRemaining);

            refreshTokenRepository.findByUser(user)
                    .ifPresentOrElse(
                            r -> {
                                r.renew(refreshToken, refreshExpiry);
                                refreshTokenRepository.save(r);
                            },
                            () -> {
                                RefreshToken r = RefreshToken.builder()
                                        .user(user)
                                        .token(refreshToken)
                                        .expiry(refreshExpiry)
                                        .build();
                                refreshTokenRepository.save(r);
                            }
                    );

            CookieUtils.addHttpOnlyCookie(
                    response,
                    REFRESH_TOKEN,
                    refreshToken,
                    (int) (refreshRemaining / 1000),
                    true
            );

            return ResponseDto.success("로그인 성공", LoginResponseDto.of(accessToken, accessExpiresIn));

        } catch (BadCredentialsException ex) {
            throw new BusinessException(ErrorCode.AUTHENTICATION_FAILED);
        } catch (Exception ex) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, ex.getMessage());
        }
    }

    // 로그아웃
    @Override
    @Transactional
    public ResponseDto<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        CookieUtils.getCookie(request, REFRESH_TOKEN).ifPresent(cookie -> {
            String refreshToken = cookie.getValue();

            if (jwtProvider.isValidToken(refreshToken)) {
                String loginId = jwtProvider.getUsernameFromJwt((refreshToken));
                userRepository.findByLoginId(loginId).ifPresent(user -> refreshTokenRepository.deleteByUser(user));
            }
        });

        CookieUtils.deleteCookie(response, REFRESH_TOKEN);

        return ResponseDto.success("로그아웃");
    }

    // 아이디 찾기
    @Override
    public ResponseDto<FindIdResponseDto> findId(FindIdRequestDto request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(ErrorCode.DUPLICATE_EMAIL));

        FindIdResponseDto response = new FindIdResponseDto(
                user.getLoginId()
        );

        return ResponseDto.success("ID를 찾았습니다.", response);
    }

    // 비밀번호 재설정
    @Override
    public ResponseDto<Void> resetPassword(PasswordResetRequest request) {
        if (!request.newPassword().equals((request.confirmPassword()))) {
            throw new BusinessException(ErrorCode.PASSWORD_CONFIRM_MISMATCH);
        }

        String token = request.token();

        if (!jwtProvider.isValidToken(token)) {
            throw new BusinessException(ErrorCode.TOKEN_INVALID);
        }

        String email = jwtProvider.getEmailFromEmailToken(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.changePassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        refreshTokenRepository.findByUser(user)
                .ifPresent(refreshTokenRepository::delete);

        return ResponseDto.success("비밀번호 재설정 완료");
    }

    // 바밀번호 재설정 메일 발송
    @Override
    public ResponseDto<Void> sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        String token = jwtProvider.generateEmailJwtToken(email, "RESET_PASSWORD");

        String url = "http://localhost:8080/api/v1/auth/reset-password?token=" + token;
        emailService.sendPasswordReset(email, url);

        return ResponseDto.success("비밀번호 재설정 이메일 전송 완료");
    }

    // 인증 상태 확인
    public boolean isVerified(String email) {
        boolean isVerified = userRepository.findByEmail(email)
                .map(User::isVerified)
                .orElse(false);

        return isVerified;
    }

    // 이메일 인증
    @Transactional
    @Override
    public ResponseDto<Void> verifyEmail(String token) {
        boolean isValid = jwtProvider.isValidEmailToken(token, "VERIFY_EMAIL");
        if(!isValid) {
            throw new BusinessException(ErrorCode.TOKEN_INVALID);
        }

        String email = jwtProvider.getEmailFromEmailToken(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if(!user.isVerified()) {
            user.verifyEmail();
        }

        return ResponseDto.success("이메일 인증이 완료되었습니다.", null);
    }

    // 리프레시 토큰
    @Override
    public ResponseDto<LoginResponseDto> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = CookieUtils.getCookie(request, REFRESH_TOKEN)
                .map(Cookie::getValue)
                .orElseThrow(() -> new BusinessException(ErrorCode.TOKEN_EXPIRED));

        if (!jwtProvider.isValidToken(refreshToken)) {
            throw new BusinessException(ErrorCode.TOKEN_INVALID);
        }

        String loginId = jwtProvider.getUsernameFromJwt(refreshToken);

        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        RefreshToken stored = refreshTokenRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException(ErrorCode.TOKEN_INVALID));

        if (!stored.getToken().equals(refreshToken)) {
            throw new BusinessException(ErrorCode.TOKEN_INVALID, "Refresh token mismatch");
        }

        if (stored.isExpired()) {
            throw new BusinessException(ErrorCode.TOKEN_EXPIRED);
        }

        var principal = userPrincipalMapper.map(user);
        Set<String> roles = principal.getAuthorities()
                .stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());

        String newAccess = jwtProvider.generateAccessToken(user.getId(), loginId, roles);
        String newRefresh = jwtProvider.generateRefreshToken(user.getId(), loginId, roles);

        long accessExpiresIn = jwtProvider.getRemainingMillis(newAccess);
        long refreshRemaining = jwtProvider.getRemainingMillis(newRefresh);

        stored.renew(newRefresh, Instant.now().plusMillis(refreshRemaining));
        refreshTokenRepository.save(stored);

        CookieUtils.addHttpOnlyCookie(
                response,
                REFRESH_TOKEN,
                newRefresh,
                (int) (refreshRemaining) / 1000,
                false
        );

        return ResponseDto.success("토큰 재발급 완료", LoginResponseDto.of(newAccess, accessExpiresIn));
    }

    // 비밀번호 토큰
    @Override
    public ResponseDto<PasswordVerifyResponseDto> verifyPasswordToken(String token) {
        if (!jwtProvider.isValidToken(token)) {
            return ResponseDto.success(PasswordVerifyResponseDto.failure());
        }

        String email = jwtProvider.getEmailFromEmailToken(token);
        return ResponseDto.success(PasswordVerifyResponseDto.success(email));
    }
}
