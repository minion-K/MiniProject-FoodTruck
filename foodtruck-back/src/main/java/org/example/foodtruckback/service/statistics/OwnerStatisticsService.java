package org.example.foodtruckback.service.statistics;

import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.statistics.response.owner.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface OwnerStatisticsService {
    ResponseDto<DashboardResponseDto> getDashboard(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate);

    ResponseDto<List<WeeklySalesResponseDto>> getWeeklySales(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate);

    ResponseDto<List<TopMenuResponseDto>> getTopMenu(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate);

    ResponseDto<Page<ScheduleSalesResponseDto>> getSchedules(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable);

    ResponseDto<ScheduleDetailResponseDto> getScheduleById(Long ownerId, Long scheduleId);

    ResponseDto<RefundResponseDto> getRefundCount(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate);

    ResponseDto<List<OrderTypeResponseDto>> getOrderTypes(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate);
}
