package org.example.foodtruckback.service.statistics.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.statistics.response.*;
import org.example.foodtruckback.repository.statistics.OwnerStatisticsRepository;
import org.example.foodtruckback.service.statistics.OwnerStatisticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@PreAuthorize("hasRole('OWNER')")
public class OwnerStatisticsServiceImpl implements OwnerStatisticsService {
    private final OwnerStatisticsRepository ownerStatisticsRepository;

    @Override
    public ResponseDto<DashboardResponseDto> getDashboard(Long ownerId, Long truckId) {
        DashboardResponseDto response = ownerStatisticsRepository.getDashBoard(ownerId, truckId);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<WeeklySalesResponseDto>> getWeeklySales(Long ownerId, Long truckId) {
        LocalDateTime fromDate = LocalDateTime.now().minusDays(7);

        List<WeeklySalesResponseDto> response =
                ownerStatisticsRepository.getWeeklySales(ownerId, fromDate, truckId).stream()
                    .map(dto -> new WeeklySalesResponseDto(
                            dto.date().toString(),
                            dto.sales()
                    ))
                    .toList();

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<TopMenuResponseDto>> getTopMenu(Long ownerId, Long truckId) {
        List<TopMenuResponseDto> response =
                ownerStatisticsRepository.getTopMenus(ownerId, truckId).stream()
                        .map(row -> new TopMenuResponseDto(
                                (String) row[0],
                                ((Number) row[1]).intValue()
                        ))
                        .limit(5)
                        .toList();

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<ScheduleSalesResponseDto>> getSchedules(Long ownerId, Long truckId) {
        List<ScheduleSalesResponseDto> response = ownerStatisticsRepository.getSchedules(ownerId, truckId);

        return ResponseDto.success(response);
    }

    @Override
    @PreAuthorize("@authz.isScheduleOwner(#scheduleId, #ownerId)")
    public ResponseDto<ScheduleDetailResponseDto> getScheduleById(Long ownerId, Long scheduleId) {
        ScheduleDetailResponseDto response = ownerStatisticsRepository.getScheduleDetail(scheduleId);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<RefundResponseDto> getRefundCount(Long ownerId, Long truckId) {
        RefundResponseDto response = ownerStatisticsRepository.getRefundCount(ownerId, truckId);

        return ResponseDto.success(response);
    }
}
