package org.example.foodtruckback.controller.schedule;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.schedule.ScheduleApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleCreateRequestDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleUpdateRequestDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.service.schedule.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(ScheduleApi.ROOT)
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;

    @PostMapping(ScheduleApi.TRUCK_SCHEDULE)
    public ResponseEntity<ResponseDto<ScheduleDetailResponseDto>> createSchedule(
            @PathVariable Long truckId,
            @Valid @RequestBody ScheduleCreateRequestDto request
    ) {
        ResponseDto<ScheduleDetailResponseDto> response = scheduleService.createSchedule(truckId,request);

        return ResponseEntity.ok(response);
    }

    @GetMapping(ScheduleApi.TRUCK_SCHEDULE)
    public ResponseEntity<ResponseDto<List<ScheduleItemResponseDto>>> getTruckSchedule(
            @PathVariable Long truckId
    ) {
        ResponseDto<List<ScheduleItemResponseDto>> response = scheduleService.getTruckSchedule(truckId);

        return ResponseEntity.ok(response);
    }

    @GetMapping(ScheduleApi.BY_ID)
    public ResponseEntity<ResponseDto<ScheduleDetailResponseDto>> getScheduleById(
            @PathVariable Long scheduleId
    ) {
        ResponseDto<ScheduleDetailResponseDto> response = scheduleService.getScheduleById(scheduleId);

        return ResponseEntity.ok(response);
    }

    // 수정
    @PutMapping(ScheduleApi.BY_ID)
    public ResponseEntity<ResponseDto<ScheduleDetailResponseDto>> updateSchedule(
            @PathVariable Long scheduleId,
            @Valid @RequestBody ScheduleUpdateRequestDto request
    ) {
        ResponseDto<ScheduleDetailResponseDto> response = scheduleService.updateSchedule(scheduleId, request);

        return ResponseEntity.ok(response);
    }

    // 삭제
    @DeleteMapping(ScheduleApi.BY_ID)
    public ResponseEntity<ResponseDto<Void>> deleteSchedule(
            @PathVariable Long scheduleId
    ) {
        ResponseDto<Void> response = scheduleService.deleteSchedule(scheduleId);

        return ResponseEntity.ok(response);
    }
}
