package org.example.foodtruckback.service.reservation;

import jakarta.validation.Valid;
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
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface ReservationService {
    ResponseDto<ReservationResponseDto> createReservation(UserPrincipal principal, @Valid ReservationCreateRequestDto request);

    ResponseDto<ReservationResponseDto> getReservationById(UserPrincipal principal, Long reservationId);

    ResponseDto<List<OwnerReservationListResponseDto>> getOwnerReservations(Long id, Long scheduleId);

    ResponseDto<List<AdminReservationListResponseDto>> getAdminReservations(Long scheduleId);

    ResponseDto<List<ReservationListResponseDto>> getMyReservations(UserPrincipal principal);

    ResponseDto<ReservationResponseDto> updateStatus(UserPrincipal principal, Long reservationId, ReservationStatusUpdateRequestDto request);

    ResponseDto<Void> cancelReservation(UserPrincipal principal, Long reservationId);

    ResponseDto<ReservationResponseDto> updateReservation(UserPrincipal principal, Long reservationId, ReservationUpdateRequestDto request);

}
