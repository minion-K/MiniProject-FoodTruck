package org.example.foodtruckback.service.schedule.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.ScheduleStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleCreateRequestDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleUpdateRequestDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.entity.location.Location;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.truck.Truck;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.location.LocationRepository;
import org.example.foodtruckback.repository.schedule.ScheduleRepository;
import org.example.foodtruckback.repository.truck.TruckRepository;
import org.example.foodtruckback.service.schedule.ScheduleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleServiceImpl implements ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final TruckRepository truckRepository;
    private final LocationRepository locationRepository;

    @Override
    @Transactional
    public ResponseDto<ScheduleDetailResponseDto> createSchedule(
            Long truckId, ScheduleCreateRequestDto request
    ) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

        Location location = locationRepository.findById(request.locationId())
                .orElseThrow(() -> new BusinessException(ErrorCode.LOCATION_NOT_FOUND));

        boolean exists = scheduleRepository.existsByTruckAndLocationAndTimeOverlap(
                truck, location, request.startTime(), request.endTime()
        );

        if(exists) {
            throw new BusinessException(ErrorCode.DUPLICATE_SCHEDULE);
        }

        Schedule schedule = new Schedule(
                truck,
                request.startTime(),
                request.endTime(),
                location,
                request.maxReservations()
        );

        Schedule saved = scheduleRepository.save(schedule);
        ScheduleDetailResponseDto response = ScheduleDetailResponseDto.from(saved);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<ScheduleItemResponseDto>> getTruckSchedule(Long truckId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

        List<Schedule> schedules = scheduleRepository.findAllByTruck(truck);

        List<ScheduleItemResponseDto> response = schedules.stream()
                .map(ScheduleItemResponseDto::from)
                .toList();

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<ScheduleDetailResponseDto> getScheduleById(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));

        ScheduleDetailResponseDto response = ScheduleDetailResponseDto.from(schedule);

        return ResponseDto.success(response);
    }

    @Override
    @Transactional
    public ResponseDto<ScheduleDetailResponseDto> updateSchedule(
            Long scheduleId, ScheduleUpdateRequestDto request
    ) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));

        Location location = null;
        if(request.locationId() != null) {
            location = locationRepository.findById(request.locationId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.LOCATION_NOT_FOUND));
        }

        if(request.startTime() != null && request.endTime() != null && location != null) {
            boolean exists = scheduleRepository.existsByTruckAndLocationAndTimeOverlapExcludingSchedule(
                    schedule.getTruck(),
                    location,
                    request.startTime(),
                    request.endTime(),
                    scheduleId
            );

            if(exists) {
                throw new BusinessException(ErrorCode.DUPLICATE_SCHEDULE);
            }
        }

        schedule.updateSchedule(
                request.startTime(),
                request.endTime(),
                request.status(),
                request.maxReservations(),
                location
        );

        ScheduleDetailResponseDto response = ScheduleDetailResponseDto.from(schedule);

        return ResponseDto.success(response);
    }

    @Override
    @Transactional
    public ResponseDto<Void> deleteSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));

        scheduleRepository.delete(schedule);

        return ResponseDto.success("해당 스케쥴이 삭제되었습니다.");
    }
}
