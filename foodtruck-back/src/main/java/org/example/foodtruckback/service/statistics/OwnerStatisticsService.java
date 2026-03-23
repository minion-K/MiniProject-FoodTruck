package org.example.foodtruckback.service.statistics;

import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.statistics.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OwnerStatisticsService {
    ResponseDto<DashboardResponseDto> getDashboard(Long ownerId, Long truckId);

    ResponseDto<List<WeeklySalesResponseDto>> getWeeklySales(Long ownerId, Long truckId);

    ResponseDto<List<TopMenuResponseDto>> getTopMenu(Long ownerId, Long truckId);

    ResponseDto<Page<ScheduleSalesResponseDto>> getSchedules(Long id, Long truckId, Pageable pageable);

    ResponseDto<ScheduleDetailResponseDto> getScheduleById(Long ownerId, Long scheduleId);

    ResponseDto<RefundResponseDto> getRefundCount(Long id, Long truckId);

    ResponseDto<List<OrderTypeResponseDto>> getOrderTypes(Long id, Long truckId);
}
