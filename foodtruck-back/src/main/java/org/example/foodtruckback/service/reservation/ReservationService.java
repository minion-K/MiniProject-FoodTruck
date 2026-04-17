package org.example.foodtruckback.service.reservation;

import jakarta.validation.Valid;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.reservation.request.ReservationCreateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationStatusUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.response.*;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface ReservationService {
    ResponseDto<ReservationResponseDto> createReservation(@Valid ReservationCreateRequestDto request);

    ResponseDto<ReservationResponseDto> getReservationById(Long reservationId);

    ResponseDto<OwnerReservationPageResponseDto> getOwnerReservations(Long ownerId, Long scheduleId, Pageable pageable);

    ResponseDto<AdminReservationPageResponseDto> getAdminReservations(Pageable pageable, String dateRange, ReservationStatus status, String keyword);

    ResponseDto<ReservationPageResponseDto> getMyReservations(Long userId, Pageable pageable, String keyword, ReservationStatus status);

    ResponseDto<ReservationResponseDto> updateStatus(Long reservationId, ReservationStatusUpdateRequestDto request);

    ResponseDto<Void> cancelReservation(Long reservationId);

    ResponseDto<ReservationResponseDto> updateReservation(Long reservationId, ReservationUpdateRequestDto request);

}
