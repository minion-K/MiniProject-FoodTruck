package org.example.foodtruckback.service.reservation;

import jakarta.validation.Valid;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.reservation.request.ReservationCreateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationStatusUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.response.ReservationListResponseDto;
import org.example.foodtruckback.dto.reservation.response.ReservationResponseDto;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.security.user.UserPrincipal;

import java.util.List;

public interface ReservationService {
    ResponseDto<ReservationResponseDto> createReservation(UserPrincipal principal, @Valid ReservationCreateRequestDto request);

    ResponseDto<ReservationResponseDto> getReservation(UserPrincipal principal, Long reservationId);

    ResponseDto<List<ReservationListResponseDto>> getReservationList(UserPrincipal principal);

    ResponseDto<ReservationResponseDto> updateStatus(UserPrincipal principal, Long reservationId, ReservationStatusUpdateRequestDto request);

    ResponseDto<Void> cancelReservation(UserPrincipal principal, Long reservationId);

    ResponseDto<ReservationResponseDto> updateReservation(UserPrincipal principal, Long reservationId, ReservationUpdateRequestDto request);
}
