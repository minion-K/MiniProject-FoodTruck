package org.example.foodtruckback.dto.user.response;

import java.util.List;

public record UserPageResponseDto(
        List<UserListResponseDto> content,
        int totalPage,
        long totalElement,
        int number
) {
}
