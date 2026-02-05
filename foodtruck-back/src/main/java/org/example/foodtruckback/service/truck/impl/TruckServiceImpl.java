package org.example.foodtruckback.service.truck.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.menuItem.response.MenuItemDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.dto.truck.request.TruckCreateRequestDto;
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
    private final LocationRepository locationRepository;
    private final AuthorizationChecker authorizationChecker;

    @Override
    @Transactional
    @PreAuthorize("@authz.checkOwnerOrAdmin()")
    public ResponseDto<TruckDetailResponseDto> createTruck(TruckCreateRequestDto request) {
        User owner = authorizationChecker.getCurrentUser();

        Truck truck = new Truck(
                owner,
                request.name(),
                request.cuisine(),
                request.status()
        );

        if(request.menuItems() != null) {
            request.menuItems().forEach(menuDto -> {
                MenuItem menu = new MenuItem(
                        truck,
                        menuDto.name(),
                        menuDto.price(),
                        menuDto.optionText()
                );

                truck.addMenu(menu);
            });
        }

        if(request.schedules() != null) {
            request.schedules().forEach(scheduleDto -> {
                Location location = locationRepository.findById(scheduleDto.locationId())
                        .orElseThrow(() -> new BusinessException(ErrorCode.LOCATION_NOT_FOUND));

                Schedule schedule = new Schedule(
                        truck,
                        scheduleDto.startTime(),
                        scheduleDto.endTime(),
                        location,
                        scheduleDto.maxReservations()
                );

                truck.addSchedule(schedule);
            });
        }

        truckRepository.save(truck);

        List<MenuItemDetailResponseDto> menuItems = truck.getMenus().stream()
                .map(MenuItemDetailResponseDto::from)
                .toList();

        List<ScheduleItemResponseDto> schedules = truck.getSchedules().stream()
                .map(ScheduleItemResponseDto::from)
                .toList();

        return ResponseDto.success(
                TruckDetailResponseDto.from(truck, schedules, menuItems)
        );
    }

    @Override
    public ResponseDto<TruckDetailResponseDto> getTruck(Long truckId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new IllegalArgumentException("트럭이 존재하지 않습니다."));

        List<ScheduleItemResponseDto> schedules = scheduleRepository.findByTruckId(truckId).stream()
                .map(ScheduleItemResponseDto::from)
                .toList();

        List<MenuItemDetailResponseDto> menuItems = menuItemRepository.findByTruckId(truckId).stream()
                .map(MenuItemDetailResponseDto::from)
                .toList();

        return ResponseDto.success(
                TruckDetailResponseDto.from(truck, schedules, menuItems)
        );
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isTruckOwner(#truckId) or @authz.checkOwnerOrAdmin()")
    public ResponseDto<TruckDetailResponseDto> updateTruck(Long truckId, TruckUpdateRequestDto request) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new IllegalArgumentException("트럭이 존재하지 않습니다."));

        truck.update(
                request.name(),
                request.cuisine(),
                request.status()
        );

        List<ScheduleItemResponseDto> schedules = scheduleRepository.findByTruckId(truckId).stream()
                .map(ScheduleItemResponseDto::from)
                .toList();

        List<MenuItemDetailResponseDto> menuItems = menuItemRepository.findByTruckId(truckId).stream()
                .map(MenuItemDetailResponseDto::from)
                .toList();

        return ResponseDto.success(
                TruckDetailResponseDto.from(truck, schedules, menuItems)
        );
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isTruckOwner(#truckId) or @authz.checkOwnerOrAdmin()")
    public ResponseDto<?> deleteTruck(Long truckId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new IllegalArgumentException("트럭이 존재하지 않습니다."));

        truckRepository.delete(truck);

        return ResponseDto.success("트럭이 삭제되었습니다.");
    }

    @Override
    public ResponseDto<List<TruckListItemResponseDto>> getAllTrucks() {
        List<TruckListItemResponseDto> list = truckRepository.findAll().stream()
                .map(TruckListItemResponseDto::from)
                .toList();

        return ResponseDto.success(list);
    }
}
