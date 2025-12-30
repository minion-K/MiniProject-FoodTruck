package org.example.foodtruckback.service.reservation.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.reservation.request.ReservationCreateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationStatusUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.response.ReservationListResponseDto;
import org.example.foodtruckback.dto.reservation.response.ReservationResponseDto;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.reservation.ReservationRepository;
import org.example.foodtruckback.repository.schedule.ScheduleRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.reservation.ReservationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.example.foodtruckback.common.enums.ReservationStatus.CONFIRMED;
import static org.example.foodtruckback.common.enums.ReservationStatus.PENDING;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    @Override
    @Transactional
    public ResponseDto<ReservationResponseDto> createReservation(
            UserPrincipal principal, ReservationCreateRequestDto request
    ) {

        Schedule schedule = scheduleRepository.findById(request.scheduleId())
                .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));

        if(!schedule.isReservation()) {
            throw new BusinessException(ErrorCode.INVALID_SCHEDULE);
        }

        if(reservationRepository.existsByUser_IdAndSchedule_IdAndStatusIn(
                principal.getId(), schedule.getId(), List.of(PENDING, CONFIRMED)
        )) {
            throw new BusinessException(ErrorCode.DUPLICATE_SCHEDULE);
        }

        User user = userRepository.getReferenceById(principal.getId());

        Reservation reservation = Reservation.createReservation(
                user,
                schedule,
                request.pickupTime(),
                request.totalAmount(),
                request.note()
        );

        ReservationResponseDto response = ReservationResponseDto.from(reservationRepository.save(reservation));

        return ResponseDto.success("예약 완료", response);
    }

    @Override
    public ResponseDto<ReservationResponseDto> getReservation(UserPrincipal principal, Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));

        if (!reservation.getUser().getLoginId().equals(principal.getLoginId())) {
            throw new IllegalArgumentException("본인 예약만 조회할 수 있습니다.");
        }

        ReservationResponseDto response = ReservationResponseDto.from(reservation);

        return ResponseDto.success("조회 성공", response);
    }

    @Override
    public ResponseDto<List<ReservationListResponseDto>> getReservationList(UserPrincipal principal) {
        List<Reservation> reservations = reservationRepository.findByUserId(principal.getId());

        List<ReservationListResponseDto> response = reservations.stream()
                .map(ReservationListResponseDto::from)
                .toList();
        return ResponseDto.success("조회 성공", response);
    }

    @Override
    @Transactional
    public ResponseDto<ReservationResponseDto> updateStatus(
            UserPrincipal principal, Long reservationId, ReservationStatusUpdateRequestDto request
    ) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        if (!reservation.getUser().getLoginId().equals(principal.getLoginId())) {
            throw new IllegalArgumentException("본인 예약만 조회할 수 있습니다.");
        }

        reservation.updateStatus(request.status(), request.note());
        ReservationResponseDto response = ReservationResponseDto.from(reservation);

        return ResponseDto.success("예약상태 수정 완료", response);
    }
}
