package org.example.foodtruckback.service.schedule;

import jakarta.validation.Valid;
import org.example.foodtruckback.common.enums.ScheduleStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleCreateRequestDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleUpdateRequestDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.entity.location.Location;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleService {
    ResponseDto<ScheduleDetailResponseDto> create(@Valid ScheduleCreateRequestDto request);
    ResponseDto<List<ScheduleItemResponseDto>> search(Long truckId, Location locationId, LocalDateTime startTime, LocalDateTime endTime, ScheduleStatus status);
    ResponseDto<ScheduleDetailResponseDto> getById(Long scheduleId);
    ResponseDto<ScheduleDetailResponseDto> update(Long scheduleId, @Valid ScheduleUpdateRequestDto request);
    ResponseDto<Void> delete(Long scheduleId);
}
