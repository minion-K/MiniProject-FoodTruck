package org.example.foodtruckback.service.statistics;

import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.statistics.response.*;

import java.util.List;

public interface OwnerStatisticsService {
    ResponseDto<DashboardResponseDto> getDashboard(Long ownerId, Long truckId);

    ResponseDto<List<WeeklySalesResponseDto>> getWeeklySales(Long ownerId, Long truckId);

    ResponseDto<List<TopMenuResponseDto>> getTopMenu(Long ownerId, Long truckId);

    ResponseDto<List<ScheduleSalesResponseDto>> getSchedules(Long ownerId, Long truckId);

    ResponseDto<ScheduleDetailResponseDto> getScheduleById(Long ownerId, Long scheduleId);

    ResponseDto<RefundResponseDto> getRefundCount(Long id, Long truckId);
}
