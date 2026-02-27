package org.example.foodtruckback.controller.reservation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.reservation.ReservationApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.reservation.request.ReservationCreateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationStatusUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.response.AdminReservationListResponseDto;
import org.example.foodtruckback.dto.reservation.response.OwnerReservationListResponseDto;
import org.example.foodtruckback.dto.reservation.response.ReservationListResponseDto;
import org.example.foodtruckback.dto.reservation.response.ReservationResponseDto;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.reservation.ReservationService;
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
        ResponseDto<ReservationResponseDto> response = reservationService.createReservation(principal, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping(ReservationApi.BY_ID)
    public ResponseEntity<ResponseDto<ReservationResponseDto>> getReservationById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reservationId
    ) {
        ResponseDto<ReservationResponseDto> response = reservationService.getReservationById(principal, reservationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping(ReservationApi.ME)
    public ResponseEntity<ResponseDto<List<ReservationListResponseDto>>> getMyReservations(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ResponseDto<List<ReservationListResponseDto>> response =  reservationService.getMyReservations(principal);

        return ResponseEntity.ok(response);
    }

    @GetMapping(ReservationApi.OWNER)
    public ResponseEntity<ResponseDto<List<OwnerReservationListResponseDto>>> getOwnerReservations(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long scheduleId
    ) {
        ResponseDto<List<OwnerReservationListResponseDto>> response =
                reservationService.getOwnerReservations(principal, scheduleId);

        return ResponseEntity.ok(response);
    }

    @GetMapping(ReservationApi.ADMIN)
    public ResponseEntity<ResponseDto<List<AdminReservationListResponseDto>>> getAdminReservations(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Long scheduleId
    ) {
        ResponseDto<List<AdminReservationListResponseDto>> response =
                reservationService.getAdminReservations(scheduleId);

        return ResponseEntity.ok(response);
    }

    @PutMapping(ReservationApi.STATUS)
    public ResponseEntity<ResponseDto<ReservationResponseDto>> updateReservationStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reservationId,
            @RequestBody ReservationStatusUpdateRequestDto request
    ) {
        ResponseDto<ReservationResponseDto> response =
                reservationService.updateStatus(principal, reservationId, request);

        return ResponseEntity.ok(response);
    }

    @PutMapping(ReservationApi.CANCEL)
    public ResponseEntity<ResponseDto<Void>> cancelReservation(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reservationId
    ) {
        ResponseDto<Void> response = reservationService.cancelReservation(principal, reservationId);

        return ResponseEntity.ok(response);
    }

    @PutMapping(ReservationApi.BY_ID)
    public ResponseEntity<ResponseDto<ReservationResponseDto>> updateReservation(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reservationId,
            @RequestBody ReservationUpdateRequestDto request
    ) {
        ResponseDto<ReservationResponseDto> response = reservationService.updateReservation(principal, reservationId, request);

        return ResponseEntity.ok(response);
    }
}
