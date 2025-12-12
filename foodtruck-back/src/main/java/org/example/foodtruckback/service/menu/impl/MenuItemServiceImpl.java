package org.example.foodtruckback.service.menu.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemCreateRequestDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemIsSoldoutRequestDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemUpdateRequestDto;
import org.example.foodtruckback.dto.menuItem.response.MenuItemDetailResponseDto;
import org.example.foodtruckback.entity.truck.MenuItem;
import org.example.foodtruckback.entity.truck.Truck;
import org.example.foodtruckback.repository.menuItem.MenuItemRepository;
import org.example.foodtruckback.repository.truck.TruckRepository;
import org.example.foodtruckback.service.menu.MenuItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuItemServiceImpl implements MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final TruckRepository truckRepository;

    @Override
    @Transactional
    public ResponseDto<MenuItemDetailResponseDto> createMenu(MenuItemCreateRequestDto request) {

        Truck truck = truckRepository.findById(request.truckId())
                .orElseThrow(() -> new IllegalArgumentException("해당 트럭을 찾을 수 없습니다."));

        MenuItem menuItem = new MenuItem(
                truck,
                request.name(),
                request.price(),
                request.optionText()
        );

        MenuItem saved = menuItemRepository.save(menuItem);

        return ResponseDto.success(MenuItemDetailResponseDto.from(saved));
    }

    @Override
    public ResponseDto<MenuItemDetailResponseDto> getMenu(Long menuId) {

        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다."));

        return ResponseDto.success(MenuItemDetailResponseDto.from(menuItem));
    }

    @Override
    public ResponseDto<List<MenuItemDetailResponseDto>> getTruckMenus(Long truckId) {

        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new IllegalArgumentException("해당 트럭을 찾을 수 없습니다."));

        List<MenuItemDetailResponseDto> menuList =
                menuItemRepository.findAllByTruck(truck).stream()
                        .map(MenuItemDetailResponseDto::from)
                        .toList();

        return ResponseDto.success(menuList);
    }

    @Override
    @Transactional
    public ResponseDto<MenuItemDetailResponseDto> updateMenu(
            Long menuId, MenuItemUpdateRequestDto request
    ) {
        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다."));

        menuItem.update(
                request.name(),
                request.price(),
                request.optionText(),
                request.isSoldOut()
        );

        return ResponseDto.success(MenuItemDetailResponseDto.from(menuItem));
    }

    @Override
    @Transactional
    public ResponseDto<?> deleteMenu(Long menuId) {

        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다."));

        menuItemRepository.delete(menuItem);

        return ResponseDto.success("해당 메뉴가 삭제되었습니다.");
    }

    @Override
    @Transactional
    public ResponseDto<MenuItemDetailResponseDto> setSoldOut(
            Long menuId, MenuItemIsSoldoutRequestDto request
    ) {
        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다."));

        menuItem.setSoldOut(request.isSoldOut());

        return ResponseDto.success(MenuItemDetailResponseDto.from(menuItem));
    }
}
