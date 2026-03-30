package org.example.foodtruckback.service.reservation;

import jakarta.validation.Valid;
import org.example.foodtruckback.common.enums.ReservationStatus;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface ReservationService {
    ResponseDto<ReservationResponseDto> createReservation(Long ownerId, @Valid ReservationCreateRequestDto request);

    ResponseDto<ReservationResponseDto> getReservationById(Long userId, Long reservationId);

    ResponseDto<List<OwnerReservationListResponseDto>> getOwnerReservations(Long ownerId, Long scheduleId);

    ResponseDto<Page<AdminReservationListResponseDto>> getAdminReservations(Long adminId, Pageable pageable, String dateRange, ReservationStatus status, String keyword);

    ResponseDto<List<ReservationListResponseDto>> getMyReservations(Long userId);

    ResponseDto<ReservationResponseDto> updateStatus(Long userId, Long reservationId, ReservationStatusUpdateRequestDto request);

    ResponseDto<Void> cancelReservation(Long userId, Long reservationId);

    ResponseDto<ReservationResponseDto> updateReservation(Long ownerId, Long reservationId, ReservationUpdateRequestDto request);

}
