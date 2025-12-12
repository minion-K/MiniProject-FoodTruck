package org.example.foodtruckback.service.menu;

import jakarta.validation.Valid;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemCreateRequestDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemIsSoldoutRequestDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemUpdateRequestDto;
import org.example.foodtruckback.dto.menuItem.response.MenuItemDetailResponseDto;

import java.util.List;

public interface MenuItemService {
    ResponseDto<MenuItemDetailResponseDto> createMenu(@Valid MenuItemCreateRequestDto request);

    ResponseDto<MenuItemDetailResponseDto> getMenu(Long menuId);

    ResponseDto<List<MenuItemDetailResponseDto>> getTruckMenus(Long truckId);

    ResponseDto<MenuItemDetailResponseDto> updateMenu(Long menuId, @Valid MenuItemUpdateRequestDto request);

    ResponseDto<?> deleteMenu(Long menuId);

    ResponseDto<MenuItemDetailResponseDto> setSoldOut(Long menuId, @Valid MenuItemIsSoldoutRequestDto request);
}
