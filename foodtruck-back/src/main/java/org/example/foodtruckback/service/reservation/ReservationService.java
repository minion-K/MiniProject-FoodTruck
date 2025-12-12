package org.example.foodtruckback.service.reservation;

import jakarta.validation.Valid;
import org.example.foodtruckback.dto.reservation.request.ReservationCreateRequestDto;
import org.example.foodtruckback.dto.reservation.response.ReservationListResponseDto;
import org.example.foodtruckback.dto.reservation.response.ReservationResponseDto;
import org.example.foodtruckback.entity.user.User;

import java.util.List;

public interface ReservationService {
    ReservationResponseDto createReservation(User user, @Valid ReservationCreateRequestDto request);

    ReservationResponseDto getReservation(User user, Long reservationId);

    List<ReservationListResponseDto> getReservationList(User user);

    ReservationResponseDto updateStatus(User user, Long reservationId, String status, String note);
}
