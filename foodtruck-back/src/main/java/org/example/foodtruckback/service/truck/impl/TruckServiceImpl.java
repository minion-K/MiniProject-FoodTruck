package org.example.foodtruckback.service.truck.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.ScheduleStatus;
import org.example.foodtruckback.common.enums.TruckStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.menuItem.response.MenuItemDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.dto.truck.request.TruckCreateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckStatusUpdateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckUpdateRequestDto;
import org.example.foodtruckback.dto.truck.response.TruckDetailResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckListItemResponseDto;
import org.example.foodtruckback.entity.location.Location;
import org.example.foodtruckback.entity.truck.MenuItem;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.truck.Truck;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.location.LocationRepository;
import org.example.foodtruckback.repository.menuItem.MenuItemRepository;
import org.example.foodtruckback.repository.schedule.ScheduleRepository;
import org.example.foodtruckback.repository.truck.TruckRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.security.util.AuthorizationChecker;
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
    public final UserRepository userRepository;
    public final ScheduleRepository scheduleRepository;
    private final MenuItemRepository menuItemRepository;
    private final AuthorizationChecker authorizationChecker;

    @Override
    @Transactional
    @PreAuthorize("@authz.isOwnerOrAdmin()")
    public ResponseDto<TruckDetailResponseDto> createTruck(
            TruckCreateRequestDto request, Long userId
    ) {
        User owner = authorizationChecker.getCurrentUser();

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
    public ResponseDto<Page<TruckListItemResponseDto>> getAllTrucks(
            Pageable pageable, String keyword, TruckStatus status
    ) {
        Page<Truck> truckPage = truckRepository.findAllWithFilter(pageable, keyword, status);

        Page<TruckListItemResponseDto> response = truckPage.map(TruckListItemResponseDto::from);

        return ResponseDto.success("트럭 조회 성공", response);
    }

    @Override
    @PreAuthorize("hasRole('OWNER')")
    public ResponseDto<List<TruckListItemResponseDto>> getOwnerTrucks(Long userId) {
        User owner = authorizationChecker.getCurrentUser();

        List<TruckListItemResponseDto> response = truckRepository.findByOwnerIdOrderByIdDesc(owner.getId()).stream()
                .map(TruckListItemResponseDto::from)
                .toList();

        return ResponseDto.success("운영자용 트럭조회 성공", response);
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isTruckOwner(#truckId) or @authz.isOwnerOrAdmin()")
    public ResponseDto<TruckDetailResponseDto> updateTruck(
            Long truckId, TruckUpdateRequestDto request, Long userId
    ) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

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
    @PreAuthorize("@authz.isTruckOwner(#truckId) or @authz.isOwnerOrAdmin()")
    public ResponseDto<Void> updateTruckStatus(
            Long truckId, TruckStatusUpdateRequestDto request, UserPrincipal principal
    ) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

        TruckStatus newStatus = request.status();

        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(user -> user.getAuthority().equals("ROLE_ADMIN"));

        boolean isOwner = principal.getAuthorities().stream()
                .anyMatch(user -> user.getAuthority().equals("ROLE_OWNER"));

        if(isOwner && !isAdmin) {
            if(newStatus == TruckStatus.SUSPENDED) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }

            if(newStatus == TruckStatus.ACTIVE) {
                boolean hasMenu = menuItemRepository.existsByTruckId(truckId);
                boolean hasOpenSchedule = scheduleRepository
                        .existsByTruckIdAndStatusAndEndTimeAfter(truckId, ScheduleStatus.OPEN, LocalDateTime.now());

                if(!hasMenu || !hasOpenSchedule) {
                    throw new BusinessException(ErrorCode.TRUCK_ACTIVATION_INVALID);
                }
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
    @PreAuthorize("@authz.isTruckOwner(#truckId) or @authz.isOwnerOrAdmin()")
    public ResponseDto<Void> deleteTruck(Long truckId, Long userId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

        truckRepository.delete(truck);

        return ResponseDto.success("트럭이 삭제되었습니다.");
    }

    private TruckDetailResponseDto toDetailDto(Truck truck) {
        List<ScheduleItemResponseDto> schedules = scheduleRepository.findByTruckId(truck.getId()).stream()
                .map(ScheduleItemResponseDto::from)
                .toList();

        List<MenuItemDetailResponseDto> menuItems = menuItemRepository.findByTruckId(truck.getId()).stream()
                .map(MenuItemDetailResponseDto::from)
                .toList();

        return TruckDetailResponseDto.from(truck, schedules, menuItems);
    }
}
