package org.example.foodtruckback.service.payment.gateway;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.PaymentMethod;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentGatewayResolver {
    private final MockPaymentGateway mockPaymentGateway;
    private final TossPayGateway tossPayGateway;

    public PaymentGateway resolve(PaymentMethod method) {
        return switch(method) {
            case MOCK -> mockPaymentGateway;
            case TOSS_PAY -> tossPayGateway;
        };
    }
}
