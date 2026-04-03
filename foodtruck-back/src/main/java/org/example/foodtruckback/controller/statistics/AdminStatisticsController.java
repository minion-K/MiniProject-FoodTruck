package org.example.foodtruckback.controller.statistics;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.statistics.AdminStatisticsApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.statistics.response.admin.*;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.statistics.AdminStatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(AdminStatisticsApi.ROOT)
public class AdminStatisticsController {
    private final AdminStatisticsService adminStatisticsService;

    @GetMapping(AdminStatisticsApi.DASHBOARD)
    public ResponseEntity<ResponseDto<DashboardResponseDto>> getAdminDashboard(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String region,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<DashboardResponseDto> response =
                adminStatisticsService.getAdminDashboard(principal.getId(), region, fromDate, toDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping(AdminStatisticsApi.GROWTH_TREND)
    public ResponseEntity<ResponseDto<List<GrowthTrendResponseDto>>> getGrowthTrend(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String region,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<List<GrowthTrendResponseDto>> response =
                adminStatisticsService.getGrowthTrend(principal.getId(), region, fromDate, toDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping(AdminStatisticsApi.CONVERSION_FUNNEL)
    public ResponseEntity<ResponseDto<ConversionFunnelResponseDto>> getConversionFunnel(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String region,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<ConversionFunnelResponseDto> response =
                adminStatisticsService.getConversionFunnel(principal.getId(), region, fromDate, toDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping(AdminStatisticsApi.PAYMENT_STATUS)
    public ResponseEntity<ResponseDto<List<PaymentStatusResponseDto>>> getPaymentStatus (
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String region,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<List<PaymentStatusResponseDto>> response =
                adminStatisticsService.getPaymentStatus(principal.getId(), region, fromDate, toDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping(AdminStatisticsApi.TOP_TRUCKS)
    public ResponseEntity<ResponseDto<List<TopTrucksResponseDto>>> getTopTrucks(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String region,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<List<TopTrucksResponseDto>> response =
                adminStatisticsService.getTopTrucks(principal.getId(), region, fromDate, toDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping(AdminStatisticsApi.TOP_MENUS)
    public ResponseEntity<ResponseDto<List<TopMenusResponseDto>>> getTopMenus(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String region,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<List<TopMenusResponseDto>> response =
                adminStatisticsService.getTopMenus(principal.getId(), region, fromDate, toDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping(AdminStatisticsApi.INSIGHTS)
    public ResponseEntity<ResponseDto<List<InsightResponseDto>>> getInsights(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String region,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<List<InsightResponseDto>> response =
                adminStatisticsService.getInsights(principal.getId(), region, fromDate, toDate);

        return ResponseEntity.ok(response);
    }
}
