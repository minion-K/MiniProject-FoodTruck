package org.example.foodtruckback.security.util;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.example.foodtruckback.entity.truck.Truck;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.reservation.ReservationRepository;
import org.example.foodtruckback.repository.truck.TruckRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component("authz")
public class AuthorizationChecker {
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final TruckRepository truckRepository;

    public boolean isUserAuthor(String loginId, Authentication principal) {
        if (loginId == null || principal == null) return false;

        String login = principal.getName();

        User user = userRepository.findByLoginId(loginId).orElse(null);

        if (user == null) return false;

        return user.getLoginId().equals(loginId);
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("로그인이 필요합니다.");
        }

        return userRepository.findByLoginId(auth.getName())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    public void checkOwnerOrAdmin() {
        User user = getCurrentUser();
        String role = user.getRoleTypes().toString();

        if (!(role.equals("ADMIN") || role.equals("OWNER"))) {
            throw new AccessDeniedException("관리자 또는 트럭오너 권한이 필요합니다.");
        }
    }

//    예약자 본인확인 체커
    public boolean isReservationOwner(Long reservationId) {
        User user = getCurrentUser();
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

        return reservation.getUser().getId().equals(user.getId());
    }

//    본인 트럭 확인
    public boolean isTruckOwner(Long truckId) {
        User user = getCurrentUser();
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

        return truck.getOwner().getId().equals(user.getId());
    }

//    본인 트럭 예약 확인
    public boolean isTruckOwnerByReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));
        Long truckId = reservation.getSchedule().getTruck().getId();

        return isTruckOwner(truckId);
    }
}
