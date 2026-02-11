package org.example.foodtruckback.controller.menu;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.menu.MenuApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemCreateRequestDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemIsSoldoutRequestDto;
import org.example.foodtruckback.dto.menuItem.request.MenuItemUpdateRequestDto;
import org.example.foodtruckback.dto.menuItem.response.MenuItemDetailResponseDto;
import org.example.foodtruckback.service.menu.MenuItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(MenuApi.ROOT)
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;

    @PostMapping
    public ResponseEntity<ResponseDto<MenuItemDetailResponseDto>> createMenu(
            @Valid @RequestBody MenuItemCreateRequestDto request
    ) {
        ResponseDto<MenuItemDetailResponseDto> data = menuItemService.createMenu(request);

        return ResponseEntity.ok(data);
    }

    @GetMapping(MenuApi.BY_ID)
    public ResponseEntity<ResponseDto<MenuItemDetailResponseDto>> getMenu(
        @PathVariable Long menuId
    ) {
        ResponseDto<MenuItemDetailResponseDto> data = menuItemService.getMenu(menuId);

        return ResponseEntity.ok(data);
    }

    @GetMapping(MenuApi.TRUCK_MENU_VIEW)
    public ResponseEntity<ResponseDto<List<MenuItemDetailResponseDto>>> getTruckMenus(
            @PathVariable Long truckId
    ) {
        ResponseDto<List<MenuItemDetailResponseDto>> data = menuItemService.getTruckMenus(truckId);

        return ResponseEntity.ok(data);
    }

    @PutMapping(MenuApi.BY_ID)
    public ResponseEntity<ResponseDto<MenuItemDetailResponseDto>> updateMenu(
            @PathVariable Long menuId,
            @Valid @RequestBody MenuItemUpdateRequestDto request
    ) {
        ResponseDto<MenuItemDetailResponseDto> data = menuItemService.updateMenu(menuId, request);

        return ResponseEntity.ok(data);
    }

    @DeleteMapping(MenuApi.BY_ID)
    public ResponseEntity<ResponseDto<?>> deleteMenu(
            @PathVariable Long menuId
    ) {
        ResponseDto<?> data = menuItemService.deleteMenu(menuId);

        return ResponseEntity.ok(data);
    }

    @PutMapping(MenuApi.SOLD_OUT)
    public ResponseEntity<ResponseDto<MenuItemDetailResponseDto>> toggleSoldOut(
            @PathVariable Long menuId,
            @Valid @RequestBody MenuItemIsSoldoutRequestDto request
    ) {
        ResponseDto<MenuItemDetailResponseDto> data = menuItemService.setSoldOut(menuId, request);

        return ResponseEntity.ok(data);
    }
}
