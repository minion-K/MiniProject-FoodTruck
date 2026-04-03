package org.example.foodtruckback.repository.statistics;

import org.example.foodtruckback.dto.statistics.response.admin.*;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminStatisticsRepository{
    DashboardResponseDto getAdminDashboard(String region, LocalDateTime fromDate, LocalDateTime toDate);

    List<GrowthTrendResponseDto> getGrowthTrend(String region, LocalDateTime fromDate, LocalDateTime toDate);

    ConversionFunnelResponseDto getConversionFunnel(String region, LocalDateTime fromDate, LocalDateTime toDate);

    List<PaymentStatusResponseDto> getPaymentStatus(String region, LocalDateTime fromDate, LocalDateTime toDate);

    List<TopTrucksResponseDto> getTopTrucks(String region, LocalDateTime fromDate, LocalDateTime toDate);

    List<TopMenusResponseDto> getTopMenus(String region, LocalDateTime fromDate, LocalDateTime toDate);

    List<InsightResponseDto> getInsights(String region, LocalDateTime fromDate, LocalDateTime toDate);
}
