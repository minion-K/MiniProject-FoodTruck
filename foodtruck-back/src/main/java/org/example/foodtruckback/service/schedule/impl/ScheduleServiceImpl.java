package org.example.foodtruckback.service.schedule.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.ScheduleStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleCreateRequestDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleStatusUpdateRequestDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleUpdateRequestDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.entity.location.Location;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.truck.Truck;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.location.LocationRepository;
import org.example.foodtruckback.repository.schedule.ScheduleRepository;
import org.example.foodtruckback.repository.truck.TruckRepository;
import org.example.foodtruckback.security.util.AuthorizationChecker;
import org.example.foodtruckback.service.policy.TruckPolicy;
import org.example.foodtruckback.service.policy.UserPolicy;
import org.example.foodtruckback.service.schedule.ScheduleService;
import org.springframework.security.access.prepost.PreAuthorize;
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
    private final AuthorizationChecker authorizationChecker;

    @Override
    @Transactional
    @PreAuthorize("@authz.isTruckOwner(#truckId)")
    public ResponseDto<ScheduleDetailResponseDto> createSchedule(
            Long truckId, ScheduleCreateRequestDto request
    ) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));
        TruckPolicy.validateActive(truck);

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
    @PreAuthorize("@authz.isScheduleOwner(#scheduleId)")
    public ResponseDto<ScheduleDetailResponseDto> updateSchedule(
            Long scheduleId, ScheduleUpdateRequestDto request
    ) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));
        TruckPolicy.validateActive(schedule.getTruck());
        Location location = schedule.getLocation();
        if(request.locationId() != null) {
            location = locationRepository.findById(request.locationId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.LOCATION_NOT_FOUND));
        }

        LocalDateTime startTime = request.startTime() != null
                ? request.startTime()
                : schedule.getStartTime();

        LocalDateTime endTime = request.endTime() != null
                ? request.endTime()
                : schedule.getEndTime();

        boolean exists = scheduleRepository.existsByTruckAndLocationAndTimeOverlapExcludingSchedule(
                schedule.getTruck(),
                location,
                startTime,
                endTime,
                scheduleId
        );

        if(exists) {
            throw new BusinessException(ErrorCode.DUPLICATE_SCHEDULE);
        }

        schedule.updateSchedule(
                request.startTime(),
                request.endTime(),
                request.maxReservations(),
                request.locationId() != null ? location : null
        );

        ScheduleDetailResponseDto response = ScheduleDetailResponseDto.from(schedule);

        return ResponseDto.success(response);
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isScheduleOwner(#scheduleId)")
    public ResponseDto<Void> updateStatus(
            Long scheduleId,
            ScheduleStatusUpdateRequestDto request
    ) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));
        TruckPolicy.validateActive(schedule.getTruck());

        if(request.status() == ScheduleStatus.OPEN) {
            boolean existOpen = scheduleRepository.existsByTruckIdAndStatus(
                    schedule.getTruck().getId(), ScheduleStatus.OPEN
            );

            if(existOpen && schedule.getStatus() != ScheduleStatus.OPEN) {
                throw new BusinessException(ErrorCode.ALREADY_OPEN_SCHEDULE_EXISTS);
            }

            LocalDateTime now = LocalDateTime.now();

            if(schedule.getEndTime().isBefore(now)) {
                throw new BusinessException(ErrorCode.INVALID_SCHEDULE_STATUS);
            }
        }

        schedule.changeStatus(request.status());

        return ResponseDto.success("해당 스케줄 상태 변경이 완료되었습니다.: " + schedule.getStatus());
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isScheduleOwner(#scheduleId)")
    public ResponseDto<Void> deleteSchedule(Long scheduleId) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));
        TruckPolicy.validateActive(schedule.getTruck());

        scheduleRepository.delete(schedule);

        return ResponseDto.success("해당 스케쥴이 삭제되었습니다.");
    }
}
