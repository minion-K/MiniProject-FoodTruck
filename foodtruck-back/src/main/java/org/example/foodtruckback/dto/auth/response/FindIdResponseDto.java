package org.example.foodtruckback.dto.auth.response;

import org.example.foodtruckback.entity.user.User;

public record FindIdResponseDto(
        String loginId
) {
    public static FindIdResponseDto from(User user) {
        return new FindIdResponseDto(
                user.getLoginId()
        );
    }
}
