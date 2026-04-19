package org.example.foodtruckback.controller.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.user.UserApi;
import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.common.enums.UserStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.role.request.RoleAddRequestDto;
import org.example.foodtruckback.dto.role.response.RoleAddResponseDto;
import org.example.foodtruckback.dto.user.request.AdminUserUpdateRequestDto;
import org.example.foodtruckback.dto.user.request.UserUpdateRequestDto;
import org.example.foodtruckback.dto.user.response.UserCountResponseDto;
import org.example.foodtruckback.dto.user.response.UserDetailResponseDto;
import org.example.foodtruckback.dto.user.response.UserPageResponseDto;
import org.example.foodtruckback.dto.user.response.UserStatusUpdateResponseDto;
import org.example.foodtruckback.service.user.UserService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(UserApi.ROOT)
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping(UserApi.ME)
    public ResponseEntity<ResponseDto<UserDetailResponseDto>> getMyInfo() {
        ResponseDto<UserDetailResponseDto> response = userService.getMyInfo();

        return ResponseEntity.ok().body(response);
    }

    @PutMapping(UserApi.ME)
    public ResponseEntity<ResponseDto<UserDetailResponseDto>> updateMyInfo(
            @Valid @RequestBody UserUpdateRequestDto request
    ) {
        ResponseDto<UserDetailResponseDto> response = userService.updateMyInfo(request);

        return ResponseEntity.ok().body(response);
    }

    @GetMapping
    public ResponseEntity<ResponseDto<UserPageResponseDto>> getAllUsers(
            @RequestParam(required = false) RoleType role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(defaultValue = "createdAt") String sortKey
            ) {
        Pageable pageable = PageRequest.of(page, size);
        ResponseDto<UserPageResponseDto> response =
                userService.getAllUsers(role, pageable, keyword, status, sortKey);

        return ResponseEntity.ok().body(response);
    }

    @GetMapping(UserApi.BY_ID)
    public ResponseEntity<ResponseDto<UserDetailResponseDto>> getById(
            @PathVariable Long userId
    ) {
        ResponseDto<UserDetailResponseDto> response = userService.getById(userId);

        return ResponseEntity.ok().body(response);
    }

    @PutMapping(UserApi.BY_ID)
    public ResponseEntity<ResponseDto<UserDetailResponseDto>> updateByUserId(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUserUpdateRequestDto request
    ) {
        ResponseDto<UserDetailResponseDto> response = userService.updateByUserId(userId, request);

        return ResponseEntity.ok().body(response);
    }

    @PostMapping(UserApi.BY_ID)
    public ResponseEntity<ResponseDto<RoleAddResponseDto>> addRoles(
            @Valid @RequestBody RoleAddRequestDto request,
            @PathVariable Long userId
    ) {
        ResponseDto<RoleAddResponseDto> response = userService.addRoles(request, userId);

        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping(UserApi.DELETE)
    public ResponseEntity<ResponseDto<Void>> deleteRoles(
            @PathVariable RoleType roleName,
            @PathVariable Long userId
            ) {
        ResponseDto<Void> response = userService.deleteRoles(roleName, userId);

        return ResponseEntity.ok().body(response);
    }

    @PutMapping(UserApi.STATUS)
    public ResponseEntity<ResponseDto<UserStatusUpdateResponseDto>> toggleUserStatus(
            @PathVariable Long userId
    ) {
        ResponseDto<UserStatusUpdateResponseDto> response  = userService.toggleUserStatus(userId);

        return ResponseEntity.ok(response);
    }

    @GetMapping(UserApi.COUNT)
    public ResponseEntity<ResponseDto<UserCountResponseDto>> getUserCount() {
        ResponseDto<UserCountResponseDto> response = userService.getUserCount();

        return ResponseEntity.ok(response);
    }

}
