package org.example.foodtruckback.service.user;

import jakarta.validation.Valid;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    ResponseDto<UserDetailResponseDto> getMyInfo(UserPrincipal principal);

    ResponseDto<UserDetailResponseDto> updateMyInfo(UserPrincipal principal, @Valid UserUpdateRequestDto request);

    ResponseDto<Page<UserListResponseDto>> getAllUsers(RoleType role, Pageable pageable, String keyword, UserStatus status, String sortKey);

    ResponseDto<UserDetailResponseDto> getById(Long userId);

    ResponseDto<UserDetailResponseDto> updateByUserId(Long userId, @Valid AdminUserUpdateRequestDto request);

    ResponseDto<RoleAddResponseDto> addRoles(UserPrincipal principal, @Valid RoleAddRequestDto request, Long userId);

    ResponseDto<Void> deleteRoles(UserPrincipal principal, RoleType roleName, Long userId);

    ResponseDto<UserStatusUpdateResponseDto> toggleUserStatus(Long id, Long userId);

}
