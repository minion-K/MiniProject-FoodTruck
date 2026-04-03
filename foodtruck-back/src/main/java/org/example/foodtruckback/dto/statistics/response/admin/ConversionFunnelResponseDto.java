package org.example.foodtruckback.dto.statistics.response.admin;

public record ConversionFunnelResponseDto(
        Long reservations,
        Long confirmedReservations,
        Long orders,
        Long paidOrders,
        Double reservationToOrderRate,
        Double orderToPaymentRate
) {}
