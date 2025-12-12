package org.example.foodtruckback.service.reservation.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.dto.reservation.request.ReservationCreateRequestDto;
import org.example.foodtruckback.dto.reservation.response.ReservationListResponseDto;
import org.example.foodtruckback.dto.reservation.response.ReservationResponseDto;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.repository.reservation.ReservationRepository;
import org.example.foodtruckback.repository.schedule.ScheduleRepository;
import org.example.foodtruckback.service.reservation.ReservationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final ScheduleRepository scheduleRepository;

    @Override
    @Transactional
    public ReservationResponseDto createReservation(
            User user, ReservationCreateRequestDto request
    ) {

        Schedule schedule = scheduleRepository.findById(request.scheduleId())
                .orElseThrow(() -> new IllegalArgumentException("스케줄이 존재하지 않습니다."));

        Reservation reservation = Reservation.createReservation(
                user,
                schedule,
                request.pickupTime(),
                request.totalAmount(),
                request.note()
        );

        return ReservationResponseDto.from(reservationRepository.save(reservation));
    }

    @Override
    public ReservationResponseDto getReservation(User user, Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("본인 예약만 조회할 수 있습니다.");
        }

        return ReservationResponseDto.from(reservation);
    }

    @Override
    public List<ReservationListResponseDto> getReservationList(User user) {
        List<Reservation> reservations = reservationRepository.findByUserId(user.getId());

        return reservations.stream()
                .map(ReservationListResponseDto::from)
                .toList();
    }

    @Override
    @Transactional
    public ReservationResponseDto updateStatus(
            User user, Long reservationId, String status, String note
    ) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("본인 예약만 조회할 수 있습니다.");
        }

        ReservationStatus newStatus;
        try {
            newStatus = ReservationStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e.getMessage());
        }

        reservation.updateStatus(newStatus, note);

        return ReservationResponseDto.from(reservation);
    }
}
