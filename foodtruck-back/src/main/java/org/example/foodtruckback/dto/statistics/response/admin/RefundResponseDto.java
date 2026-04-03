package org.example.foodtruckback.dto.statistics.response.admin;

public record RefundResponseDto(
        Long refundCount,
        Long refundAmount,
        Double refundRate
) {}
