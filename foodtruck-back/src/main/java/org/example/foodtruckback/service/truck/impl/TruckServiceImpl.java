package org.example.foodtruckback.service.truck.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
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
import org.example.foodtruckback.security.util.AuthorizationChecker;
import org.example.foodtruckback.service.truck.TruckService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            TruckCreateRequestDto request
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

        return ResponseDto.success(
                TruckDetailResponseDto.from(truck, schedules, menuItems)
        );
    }

    @Override
    public ResponseDto<TruckDetailResponseDto> getTruckById(Long truckId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

        return ResponseDto.success(toDetailDto(truck));
    }

    @Override
    public ResponseDto<List<TruckListItemResponseDto>> getAllTrucks() {
        List<TruckListItemResponseDto> list = truckRepository.findAll().stream()
                .map(TruckListItemResponseDto::from)
                .toList();

        return ResponseDto.success(list);
    }

    @Override
    @PreAuthorize("hasRole('OWNER')")
    public ResponseDto<List<TruckListItemResponseDto>> getOwnerTrucks() {
        User owner = authorizationChecker.getCurrentUser();

        List<TruckListItemResponseDto> list = truckRepository.findByOwnerIdOrderByIdDesc(owner.getId()).stream()
                .map(TruckListItemResponseDto::from)
                .toList();

        return ResponseDto.success(list);
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isTruckOwner(#truckId) or @authz.isOwnerOrAdmin()")
    public ResponseDto<TruckDetailResponseDto> updateTruck(Long truckId, TruckUpdateRequestDto request) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

        truck.update(
                request.name(),
                request.cuisine(),
                null
        );

        return ResponseDto.success(toDetailDto(truck));
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isTruckOwner(#truckId) or @authz.isOwnerOrAdmin()")
    public ResponseDto<Void> updateTruckStatus(
            Long truckId, TruckStatusUpdateRequestDto request
    ) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

        if(request.status() == TruckStatus.ACTIVE) {
            truck.activate();
        } else {
            truck.inactivate();
        }

        return ResponseDto.success("트럭 상태 변경이 완료되었습니다.");
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isTruckOwner(#truckId) or @authz.isOwnerOrAdmin()")
    public ResponseDto<Void> deleteTruck(Long truckId) {
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
