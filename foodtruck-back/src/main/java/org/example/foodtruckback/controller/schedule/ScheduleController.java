package org.example.foodtruckback.controller.schedule;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.schedule.ScheduleApi;
import org.example.foodtruckback.common.enums.ScheduleStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleCreateRequestDto;
import org.example.foodtruckback.dto.schedule.request.ScheduleUpdateRequestDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.entity.location.Location;
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

    // 생성
    @PostMapping
    public ResponseEntity<ResponseDto<ScheduleDetailResponseDto>> create(
            @Valid @RequestBody ScheduleCreateRequestDto request
    ) {
        ResponseDto<ScheduleDetailResponseDto> result = scheduleService.create(request);

        return ResponseEntity.ok().body(result);
    }

    // 검색
    @GetMapping
    public ResponseEntity<ResponseDto<List<ScheduleItemResponseDto>>> search(
            @RequestParam Long truckId,
            @RequestParam Location locationId,
            @RequestParam LocalDateTime startTime,
            @RequestParam LocalDateTime endTime,
            @RequestParam ScheduleStatus status
    ) {
        ResponseDto<List<ScheduleItemResponseDto>> result = scheduleService.search(truckId, locationId, startTime, endTime, status);

        return ResponseEntity.ok().body(result);
    }

    // 상세페이지
    @GetMapping(ScheduleApi.BY_ID)
    public ResponseEntity<ResponseDto<ScheduleDetailResponseDto>> getById(
            @PathVariable Long scheduleId
    ) {
        ResponseDto<ScheduleDetailResponseDto> result = scheduleService.getById(scheduleId);

        return ResponseEntity.ok().body(result);
    }

    // 수정
    @PutMapping(ScheduleApi.BY_ID)
    public ResponseEntity<ResponseDto<ScheduleDetailResponseDto>> update(
            @PathVariable Long scheduleId,
            @Valid @RequestBody ScheduleUpdateRequestDto request
    ) {
        ResponseDto<ScheduleDetailResponseDto> result = scheduleService.update(scheduleId, request);

        return ResponseEntity.ok().body(result);
    }

    // 삭제
    @DeleteMapping(ScheduleApi.BY_ID)
    public ResponseEntity<ResponseDto<Void>> delete(
            @PathVariable Long scheduleId
    ) {
        ResponseDto<Void> result = scheduleService.delete(scheduleId);

        return ResponseEntity.ok().body(result);
    }
}
