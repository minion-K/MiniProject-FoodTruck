package org.example.foodtruckback.controller.statistics;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.statistics.StatisticsApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.statistics.response.*;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.statistics.OwnerStatisticsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(StatisticsApi.ROOT)
public class OwnerStatisticsController {
    private final OwnerStatisticsService ownerStatisticsService;

    @GetMapping(StatisticsApi.DASHBOARD)
    public ResponseEntity<ResponseDto<DashboardResponseDto>> getDashboard(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Long truckId,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<DashboardResponseDto> response = ownerStatisticsService.getDashboard(principal.getId(), truckId, fromDate, toDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApi.WEEKLY_SALES)
    public ResponseEntity<ResponseDto<List<WeeklySalesResponseDto>>> getWeeklySales(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Long truckId,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<List<WeeklySalesResponseDto>> response = ownerStatisticsService.getWeeklySales(principal.getId(), truckId, fromDate, toDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApi.TOP_MENUS)
    public ResponseEntity<ResponseDto<List<TopMenuResponseDto>>> getTopMenu(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Long truckId,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<List<TopMenuResponseDto>> response = ownerStatisticsService.getTopMenu(principal.getId(), truckId, fromDate, toDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApi.SCHEDULES)
    public ResponseEntity<ResponseDto<Page<ScheduleSalesResponseDto>>> getSchedules(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Long truckId,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        ResponseDto<Page<ScheduleSalesResponseDto>> response = ownerStatisticsService.getSchedules(principal.getId(), truckId, fromDate, toDate, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApi.SCHEDULE_DETAIL)
    public ResponseEntity<ResponseDto<ScheduleDetailResponseDto>> getScheduleById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long scheduleId
    ) {
        ResponseDto<ScheduleDetailResponseDto> response = ownerStatisticsService.getScheduleById(principal.getId(), scheduleId);

        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApi.REFUND)
    public ResponseEntity<ResponseDto<RefundResponseDto>> getRefundCount(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Long truckId,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<RefundResponseDto> response = ownerStatisticsService.getRefundCount(principal.getId(), truckId, fromDate, toDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApi.ORDER_TYPES)
    public ResponseEntity<ResponseDto<List<OrderTypeResponseDto>>> getOrderTypes(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Long truckId,
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate
    ) {
        ResponseDto<List<OrderTypeResponseDto>> response = ownerStatisticsService.getOrderTypes(principal.getId(), truckId, fromDate, toDate);

        return ResponseEntity.ok(response);
    }
}
