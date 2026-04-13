package org.example.foodtruckback.service.menu.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemCreateRequestDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemIsSoldOutRequestDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemUpdateRequestDto;
import org.example.foodtruckback.dto.menuItem.response.MenuItemDetailResponseDto;
import org.example.foodtruckback.entity.truck.MenuItem;
import org.example.foodtruckback.entity.truck.Truck;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.menuItem.MenuItemRepository;
import org.example.foodtruckback.repository.truck.TruckRepository;
import org.example.foodtruckback.service.menu.MenuItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

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
                .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));

        boolean existsMenu = menuItemRepository.existsByName(request.name());
        if(existsMenu) {
            throw new BusinessException(ErrorCode.DUPLICATE_MENU);
        }

        MenuItem menuItem = new MenuItem(
                truck,
                request.name(),
                request.price(),
                request.optionText()
        );

        MenuItem saved = menuItemRepository.save(menuItem);
        MenuItemDetailResponseDto response = MenuItemDetailResponseDto.from(saved);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<MenuItemDetailResponseDto> getMenu(Long menuId) {

        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));

        MenuItemDetailResponseDto response = MenuItemDetailResponseDto.from(menuItem);

        return ResponseDto.success(response);
    }

    @Override
    public ResponseDto<List<MenuItemDetailResponseDto>> getTruckMenus(Long truckId) {

        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));

        List<MenuItemDetailResponseDto> response =
                menuItemRepository.findAllByTruck(truck).stream()
                        .map(MenuItemDetailResponseDto::from)
                        .toList();

        return ResponseDto.success(response);
    }

    @Override
    @Transactional
    public ResponseDto<MenuItemDetailResponseDto> updateMenu(
            Long menuId, MenuItemUpdateRequestDto request
    ) {
        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));

        String newName = request.name().trim();

        if(!menuItem.getName().equals(newName)) {
            boolean existsMenu = menuItemRepository.existsByName(newName);

            if(existsMenu) {
                throw new BusinessException(ErrorCode.DUPLICATE_MENU);
            }
        }

        if(
            menuItem.getName().equals(newName) &&
            menuItem.getPrice() == request.price() &&
            Objects.equals(menuItem.getOptionText(), request.optionText())
        ) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        menuItem.update(
                newName,
                request.price(),
                request.optionText()
        );

        MenuItemDetailResponseDto response = MenuItemDetailResponseDto.from(menuItem);

        return ResponseDto.success(response);
    }

    @Override
    @Transactional
    public ResponseDto<?> deleteMenu(Long menuId) {

        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));

        menuItemRepository.delete(menuItem);

        return ResponseDto.success("해당 메뉴가 삭제되었습니다.");
    }

    @Override
    @Transactional
    public ResponseDto<MenuItemDetailResponseDto> setSoldOut(
            Long menuId, MenuItemIsSoldOutRequestDto request
    ) {
        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));

        menuItem.setSoldOut(request.isSoldOut());

        MenuItemDetailResponseDto response = MenuItemDetailResponseDto.from(menuItem);

        return ResponseDto.success(response);
    }
}
