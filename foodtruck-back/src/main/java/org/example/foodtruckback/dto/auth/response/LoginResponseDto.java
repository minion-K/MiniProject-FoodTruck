package org.example.foodtruckback.dto.auth.response;

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
