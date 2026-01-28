package org.example.foodtruckback.dto.payment.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.common.enums.PaymentMethod;

public record PaymentCreateRequestDto(
        @NotBlank(message = "상품 코드는 필수입니다.")
        String productCode,

        @NotBlank(message = "상품 이름은 필수입니다.")
        String productName,

        @NotNull(message = "결제 금액은 필수입니다.")
        @Min(value = 100)
        Long amount,

        @NotNull(message = "결제 수단은 필수입니다.")
        PaymentMethod method
) {}
