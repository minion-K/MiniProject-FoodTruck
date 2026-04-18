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
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.menuItem.MenuItemRepository;
import org.example.foodtruckback.repository.truck.TruckRepository;
import org.example.foodtruckback.security.util.AuthorizationChecker;
import org.example.foodtruckback.service.menu.MenuItemService;
import org.example.foodtruckback.service.policy.TruckPolicy;
import org.example.foodtruckback.service.policy.UserPolicy;
import org.springframework.security.access.prepost.PreAuthorize;
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
    private final AuthorizationChecker authorizationChecker;

    @Override
    @Transactional
    @PreAuthorize("@authz.isTruckOwner(#request.truckId())")
    public ResponseDto<MenuItemDetailResponseDto> createMenu(MenuItemCreateRequestDto request) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        Truck truck = truckRepository.findById(request.truckId())
                .orElseThrow(() -> new BusinessException(ErrorCode.TRUCK_NOT_FOUND));
        TruckPolicy.validateActive(truck);

        boolean existsMenu = menuItemRepository.existsByTruckAndName(truck, request.name());
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
    @PreAuthorize("@authz.isMenuOwner(#menuId)")
    public ResponseDto<MenuItemDetailResponseDto> updateMenu(
            Long menuId, MenuItemUpdateRequestDto request
    ) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));
        TruckPolicy.validateActive(menuItem.getTruck());

        String newName = request.name().trim();
        if(!menuItem.getName().equals(newName)) {
            boolean existsMenu = menuItemRepository.existsByTruckAndName(menuItem.getTruck(), newName);

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
    @PreAuthorize("@authz.isMenuOwner(#menuId)")
    public ResponseDto<?> deleteMenu(Long menuId) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));
        TruckPolicy.validateActive(menuItem.getTruck());

        menuItemRepository.delete(menuItem);

        return ResponseDto.success("해당 메뉴가 삭제되었습니다.");
    }

    @Override
    @Transactional
    @PreAuthorize("@authz.isMenuOwner(#menuId)")
    public ResponseDto<MenuItemDetailResponseDto> setSoldOut(
            Long menuId, MenuItemIsSoldOutRequestDto request
    ) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MENU_NOT_FOUND));
        TruckPolicy.validateActive(menuItem.getTruck());

        menuItem.setSoldOut(request.isSoldOut());

        MenuItemDetailResponseDto response = MenuItemDetailResponseDto.from(menuItem);

        return ResponseDto.success(response);
    }
}
