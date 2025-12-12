package org.example.foodtruckback.service.truck.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.menuItem.response.MenuItemDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.dto.truck.request.TruckCreateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckUpdateRequestDto;
import org.example.foodtruckback.dto.truck.response.TruckDetailResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckListItemResponseDto;
import org.example.foodtruckback.entity.truck.Truck;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.repository.menuItem.MenuItemRepository;
import org.example.foodtruckback.repository.schedule.ScheduleRepository;
import org.example.foodtruckback.repository.truck.TruckRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.util.AuthorizationChecker;
import org.example.foodtruckback.service.truck.TruckService;
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
    public ResponseDto<TruckDetailResponseDto> createTruck(TruckCreateRequestDto request) {

        User owner = authorizationChecker.getCurrentUser();

        authorizationChecker.checkManagerOrAdmin();

        Truck truck = new Truck(
                owner,
                request.name(),
                request.cuisine(),
                request.status()
        );

        truckRepository.save(truck);

        List<ScheduleItemResponseDto> schedules = List.of();

        List<MenuItemDetailResponseDto> menuItems = List.of();

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
