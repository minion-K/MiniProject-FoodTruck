package org.example.foodtruckback.service.statistics.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.statistics.response.owner.*;
import org.example.foodtruckback.repository.statistics.OwnerStatisticsRepository;
import org.example.foodtruckback.service.statistics.OwnerStatisticsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public ResponseDto<DashboardResponseDto> getDashboard(
            Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate
    ) {
        DashboardResponseDto response = ownerStatisticsRepository.getDashBoard(ownerId, truckId, fromDate, toDate);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<WeeklySalesResponseDto>> getWeeklySales(
            Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate
    ) {
        List<WeeklySalesResponseDto> response =
                ownerStatisticsRepository.getWeeklySales(ownerId, truckId, fromDate, toDate).stream()
                    .map(dto -> new WeeklySalesResponseDto(
                            dto.date().toString(),
                            dto.sales()
                    ))
                    .toList();

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<TopMenuResponseDto>> getTopMenu(
            Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate
    ) {
        List<TopMenuResponseDto> response =
                ownerStatisticsRepository.getTopMenus(ownerId, truckId, fromDate, toDate).stream()
                        .map(row -> new TopMenuResponseDto(
                                (String) row[0],
                                ((Number) row[1]).intValue()
                        ))
                        .limit(5)
                        .toList();

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<Page<ScheduleSalesResponseDto>> getSchedules(
            Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable
    ) {
        Page<ScheduleSalesResponseDto> response = ownerStatisticsRepository.getSchedules(ownerId, truckId, fromDate, toDate, pageable);

        return ResponseDto.success(response);
    }

    @Override
    @PreAuthorize("@authz.isScheduleOwner(#scheduleId, #ownerId)")
    public ResponseDto<ScheduleDetailResponseDto> getScheduleById(Long ownerId, Long scheduleId) {
        List<OrderTypeResponseDto> orderTypes = ownerStatisticsRepository.getOrderTypeBySchedule(scheduleId);
        List<TopMenuResponseDto> topMenus =
                ownerStatisticsRepository.getTopMenusBySchedule(scheduleId).stream()
                        .map(row -> new TopMenuResponseDto(
                                (String) row[0],
                                ((Number) row[1]).intValue()
                        ))
                        .limit(5)
                        .toList();
        List<TimeSlotResponseDto> timeSlots =
                ownerStatisticsRepository.getTimeSlotBySchedule(scheduleId).stream()
                        .map(row -> new TimeSlotResponseDto(
                                (String) row [0],
                                ((Number) row[1]).longValue()
                        ))
                        .limit(5)
                        .toList();
        ScheduleDetailResponseDto response = new ScheduleDetailResponseDto(orderTypes, topMenus, timeSlots);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<RefundResponseDto> getRefundCount(
            Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate
    ) {
        RefundResponseDto response = ownerStatisticsRepository.getRefundCount(ownerId, truckId, fromDate, toDate);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<OrderTypeResponseDto>> getOrderTypes(
            Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate
    ) {
        List<OrderTypeResponseDto> response = ownerStatisticsRepository.getOrderTypeCounts(ownerId, truckId, fromDate, toDate);

        return ResponseDto.success(response);
    }
}
