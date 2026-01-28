package org.example.foodtruckback.service.payment.gateway;

import org.example.foodtruckback.dto.payment.request.PaymentApproveRequestDto;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class MockPaymentGateway implements PaymentGateway{

    @Override
    public PaymentResult approve(PaymentApproveRequestDto request, String userId) {
        String paymentKey = "MOCK-" + UUID.randomUUID();

        return PaymentResult.ok(paymentKey);
    }
}
