package org.example.foodtruckback.service.schedule.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ScheduleStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleCreateRequestDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleUpdateRequestDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.entity.location.Location;
import org.example.foodtruckback.service.schedule.ScheduleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleServiceImpl implements ScheduleService {

    @Override
    public ResponseDto<ScheduleDetailResponseDto> create(ScheduleCreateRequestDto request) {
        return null;
    }

    @Override
    public ResponseDto<List<ScheduleItemResponseDto>> search(Long truckId, Location locationId, LocalDateTime startTime, LocalDateTime endTime, ScheduleStatus status) {
        return null;
    }

    @Override
    public ResponseDto<ScheduleDetailResponseDto> getById(Long scheduleId) {
        return null;
    }

    @Override
    public ResponseDto<ScheduleDetailResponseDto> update(Long scheduleId, ScheduleUpdateRequestDto request) {
        return null;
    }

    @Override
    public ResponseDto<Void> delete(Long scheduleId) {
        return null;
    }
}
