package org.example.foodtruckback.controller.reservation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.reservation.ReservationApi;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.reservation.request.ReservationCreateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationStatusUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.response.*;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.reservation.ReservationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ReservationApi.ROOT)
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ResponseDto<ReservationResponseDto>> createReservation(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ReservationCreateRequestDto request
    ) {
        ResponseDto<ReservationResponseDto> response = reservationService.createReservation(principal.getId(), request);

        return ResponseEntity.ok(response);
    }

    @GetMapping(ReservationApi.BY_ID)
    public ResponseEntity<ResponseDto<ReservationResponseDto>> getReservationById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reservationId
    ) {
        ResponseDto<ReservationResponseDto> response = reservationService.getReservationById(principal.getId(), reservationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping(ReservationApi.ME)
    public ResponseEntity<ResponseDto<ReservationPageResponseDto>> getMyReservations(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ReservationStatus status
    ) {
        Pageable pageable = PageRequest.of(page, size);

        ResponseDto<ReservationPageResponseDto> response =  reservationService.getMyReservations(principal.getId(), pageable, keyword, status);

        return ResponseEntity.ok(response);
    }

    @GetMapping(ReservationApi.OWNER)
    public ResponseEntity<ResponseDto<OwnerReservationPageResponseDto>> getOwnerReservations(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long scheduleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        ResponseDto<OwnerReservationPageResponseDto> response =
                reservationService.getOwnerReservations(principal.getId(), scheduleId, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(ReservationApi.ADMIN)
    public ResponseEntity<ResponseDto<AdminReservationPageResponseDto>> getAdminReservations(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ALL") String dateRange,
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) String keyword
            ) {
        Pageable pageable = PageRequest.of(page, size);

        ResponseDto<AdminReservationPageResponseDto> response =
                reservationService.getAdminReservations(principal.getId(), pageable, dateRange, status, keyword);

        return ResponseEntity.ok(response);
    }

    @PutMapping(ReservationApi.STATUS)
    public ResponseEntity<ResponseDto<ReservationResponseDto>> updateReservationStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reservationId,
            @RequestBody ReservationStatusUpdateRequestDto request
    ) {
        ResponseDto<ReservationResponseDto> response =
                reservationService.updateStatus(principal.getId(), reservationId, request);

        return ResponseEntity.ok(response);
    }

    @PutMapping(ReservationApi.CANCEL)
    public ResponseEntity<ResponseDto<Void>> cancelReservation(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reservationId
    ) {
        ResponseDto<Void> response = reservationService.cancelReservation(principal.getId(), reservationId);

        return ResponseEntity.ok(response);
    }

    @PutMapping(ReservationApi.BY_ID)
    public ResponseEntity<ResponseDto<ReservationResponseDto>> updateReservation(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reservationId,
            @RequestBody ReservationUpdateRequestDto request
    ) {
        ResponseDto<ReservationResponseDto> response = reservationService.updateReservation(principal.getId(), reservationId, request);

        return ResponseEntity.ok(response);
    }
}
