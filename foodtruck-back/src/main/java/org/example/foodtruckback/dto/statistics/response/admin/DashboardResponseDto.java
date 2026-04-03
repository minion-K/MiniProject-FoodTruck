package org.example.foodtruckback.dto.statistics.response.admin;

public record DashboardResponseDto(
        Long totalRevenue,
        Long totalOrders,
        Long totalReservations,
        Long totalRefunds,
        Long totalUsers,
        Long activeTrucks,
        Double conversionRate,

        Double revenueChangeRate,
        Double orderChangeRate,
        Double reservationChangeRage,
        Double refundChangeRate,
        Double userChangeRate,
        Double truckChangeRate,
        Double conversionChangeRate
) {
    public static DashboardResponseDto of(
            Long totalRevenue,
            Long totalOrders,
            Long totalReservations,
            Long totalRefunds,
            Long totalUsers,
            Long activeTrucks,
            Double conversionRate
    ) {
        return new DashboardResponseDto(
                totalRevenue, totalOrders, totalReservations,
                totalRefunds, totalUsers, activeTrucks,conversionRate,
                null, null, null, null, null, null, null
        );
    }
}
