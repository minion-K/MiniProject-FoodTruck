package org.example.foodtruckback.security.oauth2.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.entity.auth.RefreshToken;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.auth.RefreshTokenRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.provider.JwtProvider;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.security.util.CookieUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.oauth2.authorized-redirect-uri}")
    private String redirectUri;

    private static final String REFRESH_TOKEN = "refreshToken";

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        String loginId = principal.getLoginId();

        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Set<String> roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        String accessToken = jwtProvider.generateAccessToken(loginId, roles);
        String refreshToken = jwtProvider.generateRefreshToken(loginId, roles);

        long refreshMillis = jwtProvider.getRemainingMillis(refreshToken);
        Instant refreshExpiry = Instant.now().plusMillis(refreshMillis);

        refreshTokenRepository.findByUser(user)
                .ifPresentOrElse(
                        rt -> rt.renew(refreshToken, refreshExpiry),
                        ()-> refreshTokenRepository.save(
                                RefreshToken.builder()
                                        .user(user)
                                        .token(refreshToken)
                                        .expiry(refreshExpiry)
                                        .build()
                        ));

        CookieUtils.addHttpOnlyCookie(
                response,
                REFRESH_TOKEN,
                refreshToken,
                (int) (refreshMillis / 1000),
                false
        );

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("accessToken", accessToken)
                .build()
                .toUriString();

        clearAuthenticationAttributes(request);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
