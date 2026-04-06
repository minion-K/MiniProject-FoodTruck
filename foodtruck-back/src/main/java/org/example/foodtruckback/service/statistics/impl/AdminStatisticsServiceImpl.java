package org.example.foodtruckback.service.statistics.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.statistics.response.admin.*;
import org.example.foodtruckback.repository.statistics.AdminStatisticsRepository;
import org.example.foodtruckback.service.statistics.AdminStatisticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatisticsServiceImpl implements AdminStatisticsService {
    private final AdminStatisticsRepository adminStatisticsRepository;

    @Override
    public ResponseDto<DashboardResponseDto> getAdminDashboard(Long adminId, String region, LocalDateTime fromDate, LocalDateTime toDate) {
        DashboardResponseDto current = adminStatisticsRepository.getAdminDashboard(region, fromDate, toDate);

        LocalDateTime prevFrom = calcPrevFrom(fromDate, toDate);
        LocalDateTime prevTo = calcPrevTo(fromDate, toDate);

        DashboardResponseDto prev = adminStatisticsRepository.getAdminDashboard(region, prevFrom, prevTo);

        DashboardResponseDto response = new DashboardResponseDto(
                current.totalRevenue(),
                current.totalOrders(),
                current.totalReservations(),
                current.totalRefunds(),
                current.totalUsers(),
                current.activeTrucks(),
                current.conversionRate(),

                calcChangeRate(current.totalRevenue(), prev.totalRevenue()),
                calcChangeRate(current.totalOrders(), prev.totalOrders()),
                calcChangeRate(current.totalReservations(), prev.totalReservations()),
                calcChangeRate(current.totalRefunds(), prev.totalRefunds()),
                calcChangeRate(current.totalUsers(), prev.totalUsers()),
                calcChangeRate(current.activeTrucks(), prev.activeTrucks()),
                calcChangeRate(current.conversionChangeRate(), prev.conversionChangeRate())
        );

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<GrowthTrendResponseDto>> getGrowthTrend(Long adminId, String region, LocalDateTime fromDate, LocalDateTime toDate) {
        List<GrowthTrendResponseDto> response = adminStatisticsRepository.getGrowthTrend(region, fromDate, toDate);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<ConversionFunnelResponseDto> getConversionFunnel(Long adminId, String region, LocalDateTime fromDate, LocalDateTime toDate) {
        ConversionFunnelResponseDto response = adminStatisticsRepository.getConversionFunnel(region, fromDate, toDate);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<PaymentStatusResponseDto>> getPaymentStatus(Long adminId, String region, LocalDateTime fromDate, LocalDateTime toDate) {
        List<PaymentStatusResponseDto> response = adminStatisticsRepository.getPaymentStatus(region, fromDate, toDate);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<OrderTypeResponseDto>> getOrderTypes(Long adminId, String region, LocalDateTime fromDate, LocalDateTime toDate) {
        List<OrderTypeResponseDto> response = adminStatisticsRepository.getOrderType(region, fromDate, toDate);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<TopTrucksResponseDto>> getTopTrucks(Long adminId, String region, LocalDateTime fromDate, LocalDateTime toDate) {
        List<TopTrucksResponseDto> response = adminStatisticsRepository.getTopTrucks(region, fromDate, toDate);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<TopMenusResponseDto>> getTopMenus(Long adminId, String region, LocalDateTime fromDate, LocalDateTime toDate) {
        List<TopMenusResponseDto> response = adminStatisticsRepository.getTopMenus(region, fromDate, toDate);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<InsightResponseDto>> getInsights(Long adminId, String region, LocalDateTime fromDate, LocalDateTime toDate) {
        List<InsightResponseDto> response = adminStatisticsRepository.getInsights(region, fromDate, toDate);

        return ResponseDto.success(response);
    }

    private LocalDateTime calcPrevFrom(LocalDateTime from, LocalDateTime to) {
        long days = ChronoUnit.DAYS.between(from.toLocalDate(), to.toLocalDate()) + 1;

        return to.minusDays(days);
    }

    private LocalDateTime calcPrevTo(LocalDateTime from, LocalDateTime to) {
        long days = ChronoUnit.DAYS.between(from.toLocalDate(), to.toLocalDate()) + 1;

        return to.minusDays(days);
    }

    private Double calcChangeRate(Number current, Number prev) {
        double cur = current != null ? current.doubleValue() : 0.0;
        double pre = prev != null ? prev.doubleValue() : 0.0;

        if(pre == 0.0) {
            return cur > 0.0 ? 100.0 : 0.0;
        }

        return ((cur - pre) / pre) * 100.0;
    }
}
