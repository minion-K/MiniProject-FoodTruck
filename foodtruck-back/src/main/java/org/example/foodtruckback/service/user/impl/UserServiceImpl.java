package org.example.foodtruckback.service.user.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.common.enums.UserStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.role.request.RoleAddRequestDto;
import org.example.foodtruckback.dto.role.response.RoleAddResponseDto;
import org.example.foodtruckback.dto.user.request.AdminUserUpdateRequestDto;
import org.example.foodtruckback.dto.user.request.UserUpdateRequestDto;
import org.example.foodtruckback.dto.user.response.*;
import org.example.foodtruckback.entity.user.Role;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.user.RoleRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public ResponseDto<UserDetailResponseDto> getMyInfo(UserPrincipal principal) {
        User user = userRepository.findByLoginId(principal.getLoginId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        UserDetailResponseDto response = UserDetailResponseDto.from(user);

        return ResponseDto.success("조회 성공", response);
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public ResponseDto<UserDetailResponseDto> updateMyInfo(
            UserPrincipal principal, UserUpdateRequestDto request
    ) {
        User user = userRepository.findByLoginId(principal.getLoginId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        String newName = (request.name() != null && !request.name().isBlank()) ? request.name() : null;
        String newPhone;

        if(request.phone() == null || request.phone().isBlank()) {
            newPhone = null;
        } else {
            newPhone = request.phone();
        }

        boolean changedName = newName != null && !Objects.equals(user.getName(), newName);
        boolean changedPhone = !Objects.equals(user.getPhone(), newPhone);

        if (changedName) user.setName(newName);
        if (changedPhone) user.setPhone(newPhone);

        UserDetailResponseDto response = UserDetailResponseDto.from(user);

        return ResponseDto.success("개인정보가 수정되었습니다.", response);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDto<UserPageResponseDto> getAllUsers(
            RoleType role, Pageable pageable, String keyword,
            UserStatus status, String sortKey
    ) {
        if(role == null) {
            throw new BusinessException(ErrorCode.INVALID_ROLE);
        }

        Page<User> userPage = userRepository.findAllByRoleWithFilter(role, pageable, keyword, status, sortKey);

        List<UserListResponseDto> content = userPage.stream()
                .map(UserListResponseDto::from)
                .toList();

        UserPageResponseDto response = new UserPageResponseDto(
                content,
                userPage.getTotalPages(),
                userPage.getTotalElements(),
                userPage.getNumber()
        );

        return ResponseDto.success("회원 목록", response);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDto<UserDetailResponseDto> getById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        return ResponseDto.success("SUCCESS", UserDetailResponseDto.from(user));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseDto<UserDetailResponseDto> updateByUserId(Long userId, AdminUserUpdateRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (request.name() == null && request.email() == null && request.phone() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        String newName = (request.name() != null && !request.name().isBlank()) ? request.name() : null;
        String newEmail = (request.email() != null && !request.email().isBlank()) ? request.email() : null;
        String newPhone = (request.phone() != null && !request.phone().isBlank()) ? request.phone() : null;

        boolean changedName = newName != null && !Objects.equals(user.getName(), newName);
        boolean changedEmail = newEmail != null && !Objects.equals(user.getEmail(), newEmail);
        boolean changedPhone = newPhone != null && !Objects.equals(user.getPhone(), newPhone);

        if (!changedName && !changedEmail && !changedPhone) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        if (changedName) user.setName(newName);
        if (changedEmail) {
            if(userRepository.findByEmail(newEmail).isPresent()) {
                throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
            }

            user.setEmail(newEmail);
            user.verifyEmail();
        }
        if (changedPhone) user.setPhone(newPhone);

        UserDetailResponseDto response = UserDetailResponseDto.from(user);

        return ResponseDto.success("개인정보가 수정되었습니다.", response);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDto<RoleAddResponseDto> addRoles(UserPrincipal principal, RoleAddRequestDto request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        RoleType roleType;

        try {
            roleType = request.roleName();
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_AUTH);
        }

        Role role = roleRepository.findById(roleType)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCESS_NOT_FOUND));

        if (user.getRoleTypes().contains(roleType)) {
            throw new BusinessException(ErrorCode.DUPLICATE_ROLE);
        }

        user.addRole(role);
        RoleAddResponseDto response = new RoleAddResponseDto(
                role.getName()
        );

        return ResponseDto.success("권한이 추가되었습니다.", response);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDto<Void> deleteRoles(UserPrincipal principal, RoleType roleName, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        RoleType roleType;
        roleType = RoleType.valueOf(roleName.name());

        Role role = roleRepository.findById(roleType)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCESS_NOT_FOUND));

        if (!user.getRoleTypes().contains(roleType)) {
            throw new BusinessException(ErrorCode.ACCESS_NOT_FOUND);
        }

        user.deleteRole(role);
        userRepository.flush();

        return ResponseDto.success("권한이 제거되었습니다.");
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDto<UserStatusUpdateResponseDto> toggleUserStatus(Long id, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        UserStatus status = user.getStatus() == UserStatus.ACTIVE ? UserStatus.TEMP : UserStatus.ACTIVE;
        user.setStatus(status);

        UserStatusUpdateResponseDto response = new UserStatusUpdateResponseDto(user.getId(), status.name());

        return ResponseDto.success("유저 상태가 변경되었습니다.", response);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDto<UserCountResponseDto> getUserCount(UserPrincipal principal) {
        long total = userRepository.count();
        long user = userRepository.countUserRole();
        long owner = userRepository.countOwnerRole();
        long admin = userRepository.countAdminRole();

        UserCountResponseDto response = new UserCountResponseDto(
                total,
                user,
                owner,
                admin
        );

        return ResponseDto.success("유저 수 조회 완료", response);
    }
}
