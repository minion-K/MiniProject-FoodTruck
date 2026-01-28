package org.example.foodtruckback.service.payment.gateway;

import org.example.foodtruckback.dto.payment.request.PaymentApproveRequestDto;

public interface PaymentGateway {
    PaymentResult approve(PaymentApproveRequestDto request, String userId);
}
