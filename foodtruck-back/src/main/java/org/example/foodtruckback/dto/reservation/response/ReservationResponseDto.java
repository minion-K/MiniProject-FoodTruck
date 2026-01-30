package org.example.foodtruckback.dto.reservation.response;

import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.common.utils.DateTimeUtil;
import org.example.foodtruckback.dto.menuItem.response.MenuItemDetailResponseDto;
import org.example.foodtruckback.dto.reservation.request.ReservationMenuItemRequestDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.example.foodtruckback.entity.truck.Schedule;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ReservationResponseDto(
        Long id,
        Long scheduleId,
        ScheduleItemResponseDto schedule,
        String username,
        LocalDateTime pickupTime,
        int totalAmount,
        ReservationStatus status,
        PaymentStatus paymentStatus,
        String note,
        String createdAt,
        String updatedAt,
        String truckName,
        String locationName,
        BigDecimal latitude,
        BigDecimal longitude,
        List<ReservationMenuItemResponseDto> menuItems
) {

    public static ReservationResponseDto from (Reservation reservation) {
        List<ReservationMenuItemResponseDto> menus = reservation.getMenuItems().stream()
                .map(ReservationMenuItemResponseDto::from)
                .toList();

        ScheduleItemResponseDto scheduleDto = ScheduleItemResponseDto.from(reservation.getSchedule());

        return new ReservationResponseDto(
                reservation.getId(),
                reservation.getSchedule().getId(),
                scheduleDto,
                reservation.getUser().getName(),
                reservation.getPickupTime(),
                reservation.getTotalAmount(),
                reservation.getStatus(),
                null,
                reservation.getNote(),
                DateTimeUtil.toKstString(reservation.getCreatedAt()),
                DateTimeUtil.toKstString(reservation.getUpdatedAt()),
                reservation.getSchedule().getTruck().getName(),
                reservation.getSchedule().getLocationName(),
                reservation.getSchedule().getLocation().getLatitude(),
                reservation.getSchedule().getLocation().getLongitude(),
                menus
        );
    }

    public static ReservationResponseDto fromWithPayment (
            Reservation reservation, PaymentStatus paymentStatus
    ) {
        List<ReservationMenuItemResponseDto> menus = reservation.getMenuItems().stream()
                .map(ReservationMenuItemResponseDto::from)
                .toList();

        ScheduleItemResponseDto scheduleDto = ScheduleItemResponseDto.from(reservation.getSchedule());

        return new ReservationResponseDto(
                reservation.getId(),
                reservation.getSchedule().getId(),
                scheduleDto,
                reservation.getUser().getName(),
                reservation.getPickupTime(),
                reservation.getTotalAmount(),
                reservation.getStatus(),
                paymentStatus,
                reservation.getNote(),
                DateTimeUtil.toKstString(reservation.getCreatedAt()),
                DateTimeUtil.toKstString(reservation.getUpdatedAt()),
                reservation.getSchedule().getTruck().getName(),
                reservation.getSchedule().getLocationName(),
                reservation.getSchedule().getLocation().getLatitude(),
                reservation.getSchedule().getLocation().getLongitude(),
                menus
        );
    }

    public static ReservationResponseDto fromWithPayment(
            Reservation reservation,
            List<ReservationMenuItemResponseDto> dtos
    ) {
        List<ReservationMenuItemResponseDto> menus = dtos.stream()
                .map(dto -> new ReservationMenuItemResponseDto(
                        dto.menuItemId(),
                        dto.name(),
                        dto.price(),
                        dto.quantity()))
                .toList();

        ScheduleItemResponseDto scheduleDto = ScheduleItemResponseDto.from(reservation.getSchedule());

        return new ReservationResponseDto(
                reservation.getId(),
                reservation.getSchedule().getId(),
                scheduleDto,
                reservation.getUser().getName(),
                reservation.getPickupTime(),
                reservation.getTotalAmount(),
                reservation.getStatus(),
                null,
                reservation.getNote(),
                DateTimeUtil.toKstString(reservation.getCreatedAt()),
                DateTimeUtil.toKstString(reservation.getUpdatedAt()),
                reservation.getSchedule().getTruck().getName(),
                reservation.getSchedule().getLocationName(),
                reservation.getSchedule().getLocation().getLatitude(),
                reservation.getSchedule().getLocation().getLongitude(),
                menus
        );
    }
}
