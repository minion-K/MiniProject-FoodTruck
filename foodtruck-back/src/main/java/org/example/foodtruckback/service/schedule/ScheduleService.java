package org.example.foodtruckback.service.schedule;

import jakarta.validation.Valid;
import org.example.foodtruckback.common.enums.ScheduleStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleCreateRequestDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleStatusUpdateRequestDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleUpdateRequestDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.entity.location.Location;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleService {
    ResponseDto<ScheduleDetailResponseDto> createSchedule(Long truckId, @Valid ScheduleCreateRequestDto request);

    ResponseDto<List<ScheduleItemResponseDto>> getTruckSchedule(Long truckId);

    ResponseDto<ScheduleDetailResponseDto> getScheduleById(Long scheduleId);

    ResponseDto<ScheduleDetailResponseDto> updateSchedule(Long scheduleId, @Valid ScheduleUpdateRequestDto request);

    ResponseDto<Void> deleteSchedule(Long scheduleId);

    ResponseDto<Void> updateStatus(Long scheduleId, @Valid ScheduleStatusUpdateRequestDto request);
}
