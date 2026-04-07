package org.example.foodtruckback.dto.auth.response;

import org.example.foodtruckback.entity.user.User;

public record FindIdResponseDto(
        String loginId
) {
    public static FindIdResponseDto from(User user) {
        String loginId = user.getLoginId();
        int visible = 2;

        if(loginId.length() <= visible * 2) {
            return new FindIdResponseDto(loginId.charAt(0) + "*");
        }

        String start = loginId.substring(0, visible);
        String end = loginId.substring(loginId.length() - visible);
        String stars = "*".repeat(loginId.length() - (visible * 2));

        return new FindIdResponseDto(start + stars + end);
    }
}
