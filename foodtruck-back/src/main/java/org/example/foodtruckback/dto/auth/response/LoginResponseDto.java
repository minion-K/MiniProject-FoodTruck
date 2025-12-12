package org.example.foodtruckback.dto.auth.response;

import java.util.Set;

public record LoginResponseDto(
        String accessToken,
        long accessTokenExpiresInMillis
) {
    public static LoginResponseDto of(String accessToken, long accessTokenExpiresInMillis) {
        return new LoginResponseDto(
                accessToken,
                accessTokenExpiresInMillis
        );
    }
}
