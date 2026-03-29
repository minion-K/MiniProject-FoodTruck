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
import org.example.foodtruckback.dto.user.response.UserDetailResponseDto;
import org.example.foodtruckback.dto.user.response.UserListResponseDto;
import org.example.foodtruckback.dto.user.response.UserStatusUpdateResponseDto;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(UserApi.ROOT)
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // 내 프로필 조회
    @GetMapping(UserApi.ME)
    public ResponseEntity<ResponseDto<UserDetailResponseDto>> getMyInfo(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ResponseDto<UserDetailResponseDto> result = userService.getMyInfo(principal);

        return ResponseEntity.ok().body(result);
    }

    // 내 프로필 수정
    @PutMapping(UserApi.ME)
    public ResponseEntity<ResponseDto<UserDetailResponseDto>> updateMyInfo(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UserUpdateRequestDto request
    ) {
        ResponseDto<UserDetailResponseDto> response = userService.updateMyInfo(principal, request);

        return ResponseEntity.ok().body(response);
    }

    // 사용자 목록
    @GetMapping
    public ResponseEntity<ResponseDto<Page<UserListResponseDto>>> getAllUsers(
            @RequestParam(required = false) RoleType role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(defaultValue = "createdAt") String sortKey
            ) {
        Pageable pageable = PageRequest.of(page, size);
        ResponseDto<Page<UserListResponseDto>> response =
                userService.getAllUsers(role, pageable, keyword, status, sortKey);

        return ResponseEntity.ok().body(response);
    }

    // 사용자 상세
    @GetMapping(UserApi.BY_ID)
    public ResponseEntity<ResponseDto<UserDetailResponseDto>> getById(
            @PathVariable Long userId
    ) {
        ResponseDto<UserDetailResponseDto> response = userService.getById(userId);

        return ResponseEntity.ok().body(response);
    }

    // 사용자 수정
    @PutMapping(UserApi.BY_ID)
    public ResponseEntity<ResponseDto<UserDetailResponseDto>> updateByUserId(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUserUpdateRequestDto request
    ) {
        ResponseDto<UserDetailResponseDto> response = userService.updateByUserId(userId, request);

        return ResponseEntity.ok().body(response);
    }

    // 권한 부여
    @PostMapping(UserApi.BY_ID)
    public ResponseEntity<ResponseDto<RoleAddResponseDto>> addRoles(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody RoleAddRequestDto request,
            @PathVariable Long userId
    ) {
        ResponseDto<RoleAddResponseDto> response = userService.addRoles(principal, request, userId);

        return ResponseEntity.ok().body(response);
    }

    // 권한 제거
    @DeleteMapping(UserApi.DELETE)
    public ResponseEntity<ResponseDto<Void>> deleteRoles(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable RoleType roleName,
            @PathVariable Long userId
            ) {
        ResponseDto<Void> response = userService.deleteRoles(principal, roleName, userId);

        return ResponseEntity.ok().body(response);
    }

    @PostMapping(UserApi.STATUS)
    public ResponseEntity<ResponseDto<UserStatusUpdateResponseDto>> toggleUserStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long userId
    ) {
        ResponseDto<UserStatusUpdateResponseDto> response  = userService.toggleUserStatus(principal.getId(), userId);

        return ResponseEntity.ok(response);
    }
}
