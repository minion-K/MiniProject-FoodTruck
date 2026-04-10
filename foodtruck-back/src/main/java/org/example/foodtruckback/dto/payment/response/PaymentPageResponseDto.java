package org.example.foodtruckback.dto.payment.response;

import java.util.List;

public record PaymentPageResponseDto(
        List<PaymentResponseDto> content,
        int totalPage,
        long totalElement,
        int number
) {
}
