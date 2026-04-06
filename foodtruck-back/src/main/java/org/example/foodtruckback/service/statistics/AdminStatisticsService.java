package org.example.foodtruckback.service.statistics;

import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.statistics.response.admin.*;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminStatisticsService {
    ResponseDto<DashboardResponseDto> getAdminDashboard(Long id, String region, LocalDateTime fromDate, LocalDateTime toDate);

    ResponseDto<List<GrowthTrendResponseDto>> getGrowthTrend(Long id, String region, LocalDateTime fromDate, LocalDateTime toDate);

    ResponseDto<ConversionFunnelResponseDto> getConversionFunnel(Long id, String region, LocalDateTime fromDate, LocalDateTime toDate);

    ResponseDto<List<PaymentStatusResponseDto>> getPaymentStatus(Long id, String region, LocalDateTime fromDate, LocalDateTime toDate);

    ResponseDto<List<OrderTypeResponseDto>> getOrderTypes(Long id, String region, LocalDateTime fromDate, LocalDateTime toDate);

    ResponseDto<List<TopTrucksResponseDto>> getTopTrucks(Long id, String region, LocalDateTime fromDate, LocalDateTime toDate);

    ResponseDto<List<TopMenusResponseDto>> getTopMenus(Long id, String region, LocalDateTime fromDate, LocalDateTime toDate);

    ResponseDto<List<InsightResponseDto>> getInsights(Long id, String region, LocalDateTime fromDate, LocalDateTime toDate);

}
