package org.example.foodtruckback.service.payment.gateway;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.dto.payment.request.PaymentApproveRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class TossPayGateway implements PaymentGateway{
    private final RestTemplate restTemplate;

    @Value("${payment.toss.secret-key}")
    private String secretKey;

    @Value("${payment.toss.base-url}")
    private String baseUrl;

    @Override
    public PaymentResult approve(PaymentApproveRequestDto request, String userId) {
        try {
            String url = baseUrl + "/v1/payments/confirm";

            String auth = Base64.getEncoder()
                    .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Basic " + auth);

            Map<String, Object> body = Map.of(
                    "paymentKey", request.paymentKey(),
                    "orderId", request.orderId(),
                    "amount", request.amount()
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

           restTemplate.postForObject(url, entity, String.class);

            return PaymentResult.ok(request.paymentKey());
        } catch(Exception e) {
            return PaymentResult.fail("TOSS_ERROR", e.getMessage());
        }
    }
}
