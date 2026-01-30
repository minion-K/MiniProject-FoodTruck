package org.example.foodtruckback.service.reservation.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.reservation.request.ReservationCreateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationMenuItemRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationStatusUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.request.ReservationUpdateRequestDto;
import org.example.foodtruckback.dto.reservation.response.ReservationListResponseDto;
import org.example.foodtruckback.dto.reservation.response.ReservationMenuItemResponseDto;
import org.example.foodtruckback.dto.reservation.response.ReservationResponseDto;
import org.example.foodtruckback.entity.payment.Payment;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.example.foodtruckback.entity.reservation.ReservationItem;
import org.example.foodtruckback.entity.truck.MenuItem;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.menuItem.MenuItemRepository;
import org.example.foodtruckback.repository.payment.PaymentRepository;
import org.example.foodtruckback.repository.reservation.ReservationRepository;
import org.example.foodtruckback.repository.schedule.ScheduleRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.reservation.ReservationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.example.foodtruckback.common.enums.ReservationStatus.CONFIRMED;
import static org.example.foodtruckback.common.enums.ReservationStatus.PENDING;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final ScheduleRepository scheduleRepository;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public ResponseDto<ReservationResponseDto> createReservation(
            @AuthenticationPrincipal UserPrincipal principal,
            ReservationCreateRequestDto request
    ) {

        Schedule schedule = scheduleRepository.findById(request.scheduleId())
                .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));

        if(!schedule.isReservation()) {
            throw new BusinessException(ErrorCode.INVALID_SCHEDULE);
        }

        LocalDateTime pickupTime = request.pickupTime()
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        if(pickupTime.isBefore(schedule.getStartTime())
            || pickupTime.isAfter(schedule.getEndTime())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        boolean exist = reservationRepository.existsByUser_IdAndSchedule_IdAndPickupTimeAndStatusIn(
                principal.getId(), schedule.getId(),request.pickupTime(), List.of(PENDING, CONFIRMED)
        );

        if(exist) {
            throw new BusinessException(ErrorCode.DUPLICATE_RESERVATION);
        }

        User user = userRepository.getReferenceById(principal.getId());

        int totalAmount = 0;

        for(ReservationMenuItemRequestDto menuRequest: request.menuItems()) {
            MenuItem menu = menuItemRepository.findById(menuRequest.menuItemId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));

            if(!menu.getTruck().getId().equals(schedule.getTruck().getId())) {
                throw new BusinessException(ErrorCode.INVALID_MENU);
            }

            if(menu.isSoldOut()) {
                throw new BusinessException(ErrorCode.MENU_SOLD_OUT);
            }

            totalAmount += menu.getPrice() * menuRequest.quantity();
        }

        Reservation reservation = Reservation.createReservation(
                user,
                schedule,
                pickupTime,
                totalAmount,
                request.note()
        );

        for(ReservationMenuItemRequestDto menuRequest: request.menuItems()) {
            MenuItem menu = menuItemRepository.findById((menuRequest.menuItemId()))
                    .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));

            reservation.addMenuItem(
                    ReservationItem.create(
                            reservation,
                            menu.getId(),
                            menu.getName(),
                            menu.getPrice(),
                            menuRequest.quantity()
                    )
            );
        }

        Reservation saved = reservationRepository.save(reservation);
        ReservationResponseDto response = ReservationResponseDto.from(saved);

        return ResponseDto.success("예약 완료", response);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or @authz.isReservationOwner(#reservationId) or @authz.isTruckOwnerByReservation(#reservationId)")
    public ResponseDto<ReservationResponseDto> getReservation(
            @AuthenticationPrincipal UserPrincipal principal,
            Long reservationId
    ) {
        Reservation reservation = reservationRepository.findDetail(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

        String productCode = "RES-" + reservation.getId();
        PaymentStatus paymentStatus = paymentRepository
                .findTopByProductCodeOrderByCreatedAt(productCode)
                .map(Payment::getStatus)
                .orElse(PaymentStatus.READY);

        ReservationResponseDto response = ReservationResponseDto.fromWithPayment(reservation, paymentStatus);

        return ResponseDto.success("조회 성공", response);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','OWNER','USER')")
    public ResponseDto<List<ReservationListResponseDto>> getReservationList(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        User user = userRepository.getReferenceById(principal.getId());

        List<Reservation> reservations;

        if(user.getRoleTypes().contains("ADMIN")) {
            reservations = reservationRepository.findForAdminReservationList();

        } else if(user.getRoleTypes().contains("OWNER")) {
            reservations = reservationRepository.findForOwnerReservationList(user.getId());
        } else {
            reservations = reservationRepository.findForUserReservationList(user.getId());
        }

        List<ReservationListResponseDto> response = reservations.stream()
                .map(reservation -> {
                    String productCode = "RES-" + reservation.getId();

                    PaymentStatus paymentStatus = paymentRepository
                            .findTopByProductCodeOrderByCreatedAt(productCode)
                            .map(Payment::getStatus)
                            .orElse(PaymentStatus.READY);

                    return ReservationListResponseDto.from(reservation, paymentStatus);
                })
                .toList();

        return ResponseDto.success("조회 성공", response);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or @authz.isTruckOwnerByReservation(#reservationId)")
    public ResponseDto<ReservationResponseDto> updateStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            Long reservationId,
            ReservationStatusUpdateRequestDto request
    ) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        reservation.updateStatus(request.status(), request.note());
        ReservationResponseDto response = ReservationResponseDto.from(reservation);

        return ResponseDto.success("예약상태 수정 완료", response);
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isReservationOwner(#reservationId)")
    public ResponseDto<Void> cancelReservation(
            @AuthenticationPrincipal UserPrincipal principal,
            Long reservationId
    ) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

        reservation.cancelByUser();

        return ResponseDto.success("예약이 취소되었습니다.");
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or @authz.isReservationOwner(#reservationId) or @authz.isTruckOwnerByReservation(#reservationId)")
    public ResponseDto<ReservationResponseDto> updateReservation(
            UserPrincipal principal,
            Long reservationId,
            ReservationUpdateRequestDto request
    ) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

        if(reservation.getStatus() != ReservationStatus.PENDING) {
            throw new BusinessException(ErrorCode.INVALID_RESERVATION_STATUS);
        }

        Schedule schedule = reservation.getSchedule();

        LocalDateTime pickupTime = request.pickupTime()
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        if(pickupTime.isBefore(schedule.getStartTime())
                || pickupTime.isAfter(schedule.getEndTime())
        ) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        boolean exists = reservationRepository.existsByUser_IdAndSchedule_IdAndPickupTimeAndStatusInAndIdNot(
                reservation.getUser().getId(),
                schedule.getId(),
                pickupTime,
                List.of(ReservationStatus.PENDING, ReservationStatus.CONFIRMED),
                reservationId
        );

        if(exists) {
            throw new BusinessException(ErrorCode.DUPLICATE_RESERVATION);
        }

        int totalAmount = 0;

        List<ReservationItem> newItems = new ArrayList<>();

        for(ReservationMenuItemRequestDto menuRequest: request.menuItems()) {
            MenuItem menu = menuItemRepository.findById(menuRequest.menuItemId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));

            if(!menu.getTruck().getId().equals(schedule.getTruck().getId())) {
                throw new BusinessException(ErrorCode.INVALID_MENU);
            }

            if(menu.isSoldOut()) {
                throw new BusinessException(ErrorCode.MENU_SOLD_OUT);
            }

            totalAmount += menu.getPrice() * menuRequest.quantity();

            newItems.add(
                    ReservationItem.create(
                            reservation,
                            menu.getId(),
                            menu.getName(),
                            menu.getPrice(),
                            menuRequest.quantity()
                    )
            );
        }

        reservation.updateContent(
                pickupTime,
                request.note(),
                totalAmount,
                newItems
        );

        List<ReservationMenuItemResponseDto> menuDtos = newItems.stream()
                .map(ReservationMenuItemResponseDto::from)
                .toList();
        ReservationResponseDto updatedReservation = ReservationResponseDto.fromWithPayment(reservation, menuDtos);

        return ResponseDto.success("예약 수정 성공적으로 변경되었습니다.", updatedReservation);
    }
}
