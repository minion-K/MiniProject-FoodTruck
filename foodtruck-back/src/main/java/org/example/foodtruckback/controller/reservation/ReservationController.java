package org.example.foodtruckback.controller.reservation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.reservation.ReservationApi;
import org.example.foodtruckback.dto.reservation.request.ReservationCreateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationStatusUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.response.ReservationListResponseDto;
import org.example.foodtruckback.dto.reservation.response.ReservationResponseDto;
import org.example.foodtruckback.entity.user.User;
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
    public ResponseEntity<ReservationResponseDto> createReservation(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ReservationCreateRequestDto request
    ) {
        ReservationResponseDto response = reservationService.createReservation(user, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping(ReservationApi.BY_ID)
    public ResponseEntity<ReservationResponseDto> getReservation(
            @AuthenticationPrincipal User user,
            @PathVariable Long reservationId
    ) {
        return ResponseEntity.ok(reservationService.getReservation(user, reservationId));
    }

    @GetMapping
    public ResponseEntity<List<ReservationListResponseDto>> getReservationList(
            @AuthenticationPrincipal User user
    ) {
        List<ReservationListResponseDto> list =  reservationService.getReservationList(user);
        return ResponseEntity.ok(list);
    }

    @PatchMapping(ReservationApi.CANCEL)
    public ResponseEntity<ReservationResponseDto> cancelReservation(
            @AuthenticationPrincipal User user,
            @PathVariable Long reservationId,
            @RequestBody(required = false) ReservationStatusUpdateRequestDto request
    ) {
        ReservationResponseDto response = reservationService.updateStatus(
                user, reservationId, "CANCELED", request != null ? request.note() : null
        );
        return ResponseEntity.ok(response);
    }

    @PatchMapping(ReservationApi.CONFIRM)
    public ResponseEntity<ReservationResponseDto> confirmReservation(
            @AuthenticationPrincipal User user,
            @PathVariable Long reservationId,
            @RequestBody(required = false) ReservationStatusUpdateRequestDto request
    ) {
        ReservationResponseDto response = reservationService.updateStatus(
                user, reservationId, "CONFIRM", request != null ? request.note() : null
        );
        return ResponseEntity.ok(response);
    }

    @PatchMapping(ReservationApi.NO_SHOW)
    public ResponseEntity<ReservationResponseDto> noShowReservation(
            @AuthenticationPrincipal User user,
            @PathVariable Long reservationId,
            @RequestBody(required = false) ReservationStatusUpdateRequestDto request
    ) {
        ReservationResponseDto response = reservationService.updateStatus(
                user, reservationId, "NO_SHOW", request != null ? request.note() : null
        );
        return ResponseEntity.ok(response);
    }
}
