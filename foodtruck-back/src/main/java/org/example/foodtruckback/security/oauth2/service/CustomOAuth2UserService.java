package org.example.foodtruckback.security.oauth2.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.foodtruckback.common.enums.AuthProvider;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.entity.user.Role;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.user.RoleRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.oauth2.user.GoogleOAuth2UserInfo;
import org.example.foodtruckback.security.oauth2.user.KakaoOAuth2UserInfo;
import org.example.foodtruckback.security.oauth2.user.NaverOAuth2UserInfo;
import org.example.foodtruckback.security.oauth2.user.OAuth2UserInfo;
import org.example.foodtruckback.security.user.UserPrincipalMapper;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserPrincipalMapper userPrincipalMapper;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(request);

        String registrationId = request.getClientRegistration().getRegistrationId();
        AuthProvider provider = mapProvider(registrationId);

        OAuth2UserInfo userInfo = convertToUserInfo(provider, oAuth2User.getAttributes());

        User user = upsertUser(provider, userInfo);

        return userPrincipalMapper.toPrincipal(user.getLoginId());

    }

    private AuthProvider mapProvider(String registrationId) {
        return switch (registrationId.toLowerCase()) {
            case "google" -> AuthProvider.GOOGLE;
            case "kakao" -> AuthProvider.KAKAO;
            case "naver" -> AuthProvider.NAVER;
            default -> throw new IllegalArgumentException("지원하지 않는 Provider: " + registrationId);
        };
    }

    private OAuth2UserInfo convertToUserInfo(
            AuthProvider provider,
            Map<String, Object> attributes
    ) {
        return switch (provider) {
            case GOOGLE -> new GoogleOAuth2UserInfo(attributes);
            case KAKAO -> new KakaoOAuth2UserInfo(attributes);
            case NAVER -> new NaverOAuth2UserInfo(attributes);
            default -> throw new IllegalArgumentException("지원하지 않는 Provider: " + provider);
        };
    }

    @Transactional
    protected User upsertUser(AuthProvider provider, OAuth2UserInfo userInfo) {
        String providerId = userInfo.getId();

        String email = userInfo.getEmail();
        String name = userInfo.getName();

        return userRepository.findByProviderAndProviderId(provider, providerId)
                .map(user -> {
                    user.updateOauthProfile(name, email);

                    return user;
                })
                .orElseGet(() -> {
                    User emailUser = userRepository.findByEmail(email)
                            .map(user -> {
                                if(user.getProvider() == AuthProvider.LOCAL) {
                                    user.connectProvider(provider, providerId);
                                    user.updateOauthProfile(name, email);

                                    return user;
                                }
                                throw new BusinessException(ErrorCode.DUPLICATE_USER);
                            })
                            .orElse(null);

                    if(emailUser != null) {
                        return emailUser;
                    }

                    User newUser = User.createOauthUser(
                            provider,
                            providerId,
                            email,
                            name
                    );

                    Role userRole = roleRepository.findById(RoleType.USER)
                            .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

                    newUser.grantRole(userRole);

                    return userRepository.save(newUser);
                });

    }
}
