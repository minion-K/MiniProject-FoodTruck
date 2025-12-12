package org.example.foodtruckback.service.user;

import jakarta.validation.Valid;
import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.role.request.RoleAddRequestDto;
import org.example.foodtruckback.dto.role.response.RoleAddResponseDto;
import org.example.foodtruckback.dto.user.request.UserUpdateRequestDto;
import org.example.foodtruckback.dto.user.response.UserDetaileResponseDto;
import org.example.foodtruckback.dto.user.response.UserListResponseDto;
import org.example.foodtruckback.security.user.UserPrincipal;

import java.util.List;

public interface UserService {
    ResponseDto<UserDetaileResponseDto> getMyInfo(UserPrincipal principal);

    ResponseDto<UserDetaileResponseDto> updateMyInfo(UserPrincipal principal, @Valid UserUpdateRequestDto request);

    ResponseDto<List<UserListResponseDto>> getAllUsers();

    ResponseDto<UserDetaileResponseDto> getById(UserPrincipal principal);

    ResponseDto<UserDetaileResponseDto> updateByUserId(UserPrincipal principal, @Valid UserUpdateRequestDto request);

    ResponseDto<RoleAddResponseDto> addRoles(UserPrincipal principal, @Valid RoleAddRequestDto request);

    ResponseDto<Void> deleteRoles(UserPrincipal principal, @Valid RoleType roleName);
}
