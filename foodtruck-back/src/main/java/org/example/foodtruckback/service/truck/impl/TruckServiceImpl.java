package org.example.foodtruckback.service.truck.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.common.enums.ScheduleStatus;
import org.example.foodtruckback.common.enums.TruckStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.menuItem.response.MenuItemDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.dto.truck.request.TruckCreateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckStatusUpdateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckUpdateRequestDto;
import org.example.foodtruckback.dto.truck.response.TruckCountResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckDetailResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckListItemResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckPageResponseDto;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.truck.Truck;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.menuItem.MenuItemRepository;
import org.example.foodtruckback.repository.schedule.ScheduleRepository;
import org.example.foodtruckback.repository.truck.TruckRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.util.AuthorizationChecker;
import org.example.foodtruckback.service.policy.TruckPolicy;
import org.example.foodtruckback.service.policy.UserPolicy;
import org.example.foodtruckback.service.truck.TruckService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TruckServiceImpl implements TruckService {
    public final TruckRepository truckRepository;
    public final ScheduleRepository scheduleRepository;
    private final MenuItemRepository menuItemRepository;
    private final AuthorizationChecker authorizationChecker;

    @Override
    @Transactional
    @PreAuthorize("@authz.isOwnerOrAdmin()")
    public ResponseDto<TruckDetailResponseDto> createTruck(
            TruckCreateRequestDto request
    ) {
        User owner = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(owner);

        Truck truck = new Truck(
                owner,
                request.name(),
                request.cuisine()
        );

        truckRepository.save(truck);

        List<MenuItemDetailResponseDto> menuItems = List.of();
        List<ScheduleItemResponseDto> schedules = List.of();

        TruckDetailResponseDto response = TruckDetailResponseDto.from(truck, schedules, menuItems);

        return ResponseDto.success("트럭 생성 성공.", response);
    }

    @Override
    public ResponseDto<TruckDetailResponseDto> getTruckById(Long truckId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

        TruckDetailResponseDto response = toDetailDto(truck);

        return ResponseDto.success("트럭 단건조회 성공", response);
    }

    @Override
    public ResponseDto<TruckPageResponseDto> getAllTrucks(
            Pageable pageable, String keyword, TruckStatus status
    ) {
        Page<Truck> truckPage = truckRepository.findAllWithFilter(pageable, keyword, status);

        List<TruckListItemResponseDto> content = truckPage.stream()
                .map(TruckListItemResponseDto::from).toList();

        TruckPageResponseDto response = new TruckPageResponseDto(
                content,
                truckPage.getTotalPages(),
                truckPage.getTotalElements(),
                truckPage.getNumber()
        );

        return ResponseDto.success("트럭 조회 성공", response);
    }

    @Override
    @PreAuthorize("hasRole('OWNER')")
    public ResponseDto<TruckPageResponseDto> getOwnerTrucks(Pageable pageable) {
        User owner = authorizationChecker.getCurrentUser();

        Page<Truck> truckPage = truckRepository.findByOwnerIdOrderByIdDesc(owner.getId(), pageable);

        List<TruckListItemResponseDto> content = truckPage.stream()
                .map(TruckListItemResponseDto::from)
                .toList();
        TruckPageResponseDto response = new TruckPageResponseDto(
                content,
                truckPage.getTotalPages(),
                truckPage.getTotalElements(),
                truckPage.getNumber()
        );

        return ResponseDto.success("운영자용 트럭조회 성공", response);
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isTruckOwner(#truckId) or @hasRole('ADMIN')")
    public ResponseDto<TruckDetailResponseDto> updateTruck(
            Long truckId, TruckUpdateRequestDto request
    ) {
        User owner = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(owner);

        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));
        TruckPolicy.validateActive(truck);

        truck.update(
                request.name(),
                request.cuisine(),
                null
        );

        TruckDetailResponseDto response = toDetailDto(truck);

        return ResponseDto.success("트럭 정보수정 성공", response);
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isTruckOwner(#truckId) or hasRole('ADMIN')")
    public ResponseDto<Void> updateTruckStatus(
            Long truckId, TruckStatusUpdateRequestDto request
    ) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

        TruckStatus newStatus = request.status();

        boolean isAdmin = user.getRoleTypes().contains(RoleType.ADMIN);
        boolean isOwner = user.getRoleTypes().contains(RoleType.OWNER);

        if(isOwner && !isAdmin) {
            TruckPolicy.validateActive(truck);

            if(newStatus == TruckStatus.ACTIVE) {
                boolean hasMenu = menuItemRepository.existsByTruckId(truckId);
                boolean hasOpenSchedule = scheduleRepository
                        .existsByTruckIdAndStatusAndEndTimeAfter(truckId, ScheduleStatus.OPEN, LocalDateTime.now());

                if(!hasMenu || !hasOpenSchedule) {
                    throw new BusinessException(ErrorCode.TRUCK_ACTIVATION_INVALID);
                }
            }

            if(newStatus == TruckStatus.INACTIVE) {
                List<Schedule> openSchedules = scheduleRepository.findByTruckIdAndStatus(truckId, ScheduleStatus.OPEN);

                openSchedules.forEach(schedule ->
                        schedule.changeStatus(ScheduleStatus.CLOSED));
            }

            truck.changeStatus(newStatus);
        } else if(isAdmin) {
            truck.changeStatus(newStatus);
        } else {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        return ResponseDto.success("트럭 상태 변경이 완료되었습니다.");
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isTruckOwner(#truckId) or hasRole('ADMIN')")
    public ResponseDto<Void> deleteTruck(Long truckId) {
        User owner = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(owner);

        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));
        TruckPolicy.validateActive(truck);

        truckRepository.delete(truck);

        return ResponseDto.success("트럭이 삭제되었습니다.");
    }

    @Override
    public ResponseDto<TruckCountResponseDto> getTruckCount() {
        long total = truckRepository.count();
        long active = truckRepository.countTruckActive();
        long suspended = truckRepository.countTruckSuspended();

        TruckCountResponseDto response = new TruckCountResponseDto(
                total,
                active,
                suspended
        );

        return ResponseDto.success("트럭 수 조회", response);
    }

    private TruckDetailResponseDto toDetailDto(Truck truck) {
        List<ScheduleItemResponseDto> schedules = scheduleRepository.findByTruckId(truck.getId()).stream()
                .map(ScheduleItemResponseDto::from)
                .sorted((a, b) -> {
                    int p1 = getPriority(a);
                    int p2 = getPriority(b);

                    if(p1 != p2) return p1 - p2;

                    if(p1 ==1 || p1 ==2 ) {
                        return a.startTime().compareTo(b.startTime());
                    }

                    return b.startTime().compareTo(a.startTime());
                })
                .toList();

        List<MenuItemDetailResponseDto> menuItems = menuItemRepository.findByTruckId(truck.getId()).stream()
                .map(MenuItemDetailResponseDto::from)
                .toList();

        return TruckDetailResponseDto.from(truck, schedules, menuItems);
    }

    private int getPriority(ScheduleItemResponseDto dto) {
        if(dto.status() == ScheduleStatus.OPEN) return 0;

        if(dto.status() == ScheduleStatus.PLANNED) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime soon = now.plusHours(24);

            if(!dto.startTime().isAfter(soon)) {
                return 1;
            }

            return 2;
        }

        return 3;
    }
}
