package org.example.foodtruckback.service.user.impl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.role.request.RoleAddRequestDto;
import org.example.foodtruckback.dto.role.response.RoleAddResponseDto;
import org.example.foodtruckback.dto.user.request.UserUpdateRequestDto;
import org.example.foodtruckback.dto.user.response.UserDetaileResponseDto;
import org.example.foodtruckback.dto.user.response.UserListResponseDto;
import org.example.foodtruckback.entity.user.Role;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.user.RoleRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.user.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    // 마이 페이지
    @Override
    public ResponseDto<UserDetaileResponseDto> getMyInfo(UserPrincipal principal) {

        User user = userRepository.findByLoginId(principal.getLoginId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        UserDetaileResponseDto response = UserDetaileResponseDto.from(user);

        return ResponseDto.success("조회 성공", response);
    }

    // 정보 수정
    @Override
    @Transactional
    @PreAuthorize("@authz.isCommentAuthor(#principal, authentication)")
    public ResponseDto<UserDetaileResponseDto> updateMyInfo(UserPrincipal principal, UserUpdateRequestDto request) {
        User user = userRepository.findByLoginId(principal.getLoginId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (request.name() == null && request.email() == null && request.phone() == null) {
            throw new IllegalArgumentException("수정할 정보를 입력해주세요");
        }

        String newName = (request.name() != null && !request.name().isBlank()) ? request.name() : null;
        String newEmail = (request.email() != null && !request.email().isBlank()) ? request.email() : null;
        String newPhone = (request.phone() != null && !request.phone().isBlank()) ? request.phone() : null;

        boolean changedNickname = newName != null && !Objects.equals(user.getName(), request.name());
        boolean changedEmail = newEmail != null && !Objects.equals(user.getEmail(), request.email());
        boolean changedPhone = newPhone != null && !Objects.equals(user.getPhone(), request.phone());

        if (!changedNickname && !changedEmail && !changedPhone) {
            throw new IllegalArgumentException("변경된 개인정보가 없습니다.");
        }

        if (changedNickname) user.setName(newName);
        if (changedEmail) user.setEmail(newEmail);
        if (changedPhone) user.setPhone(newPhone);

        UserDetaileResponseDto response = UserDetaileResponseDto.from(user);

        return ResponseDto.success("개인정보가 수정되었습니다.", response);
    }

    // 유저 리스트
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDto<List<UserListResponseDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserListResponseDto> result = users.stream()
                .map(UserListResponseDto::from)
                .toList();

        return ResponseDto.success("회원 목록", result);
    }

    //단건
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDto<UserDetaileResponseDto> getById(UserPrincipal principal) {
        User user = userRepository.findByLoginId(principal.getLoginId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        return ResponseDto.success("SUCCESS", UserDetaileResponseDto.from(user));
    }


    // 회원 수정
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDto<UserDetaileResponseDto> updateByUserId(UserPrincipal principal, UserUpdateRequestDto request) {
        User user = userRepository.findByLoginId(principal.getLoginId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (request.name() == null && request.email() == null && request.phone() == null) {
            throw new IllegalArgumentException("수정할 정보를 입력해주세요");
        }

        String newName = (request.name() != null && !request.name().isBlank()) ? request.name() : null;
        String newEmail = (request.email() != null && !request.email().isBlank()) ? request.email() : null;
        String newPhone = (request.phone() != null && !request.phone().isBlank()) ? request.phone() : null;

        boolean changedNickname = newName != null && !Objects.equals(user.getName(), request.name());
        boolean changedEmail = newEmail != null && !Objects.equals(user.getEmail(), request.email());
        boolean changedPhone = newPhone != null && !Objects.equals(user.getPhone(), request.phone());

        if (!changedNickname && !changedEmail && !changedPhone) {
            throw new IllegalArgumentException("변경된 개인정보가 없습니다.");
        }

        if (changedNickname) user.setName(newName);
        if (changedEmail) user.setEmail(newEmail);
        if (changedPhone) user.setPhone(newPhone);

        UserDetaileResponseDto response = UserDetaileResponseDto.from(user);

        return ResponseDto.success("개인정보가 수정되었습니다.", response);
    }

    //권한 추가
    @Override
    @Transactional
    public ResponseDto<RoleAddResponseDto> addRoles(UserPrincipal principal, RoleAddRequestDto request) {
        User user = userRepository.findByLoginId(principal.getLoginId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        RoleType roleType;

        try {
            roleType = RoleType.valueOf(request.name());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_AUTH);
        }

        Role role = roleRepository.findByName(roleType)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCESS_NOT_FOUND));

        if (user.getRoleTypes().contains(roleType)) {
            throw new IllegalArgumentException("해당 권한을 이미 보유 중입니다.");
        }

        user.addRole(role);
        userRepository.flush();

        RoleAddResponseDto response = new RoleAddResponseDto(
                role.getName()
        );

        return ResponseDto.success("권한이 추가되었습니다.", response);
    }

    // 권한 제거
    @Override
    @Transactional
    public ResponseDto<Void> deleteRoles(UserPrincipal principal, RoleType roleName) {
        User user = userRepository.findByLoginId(principal.getLoginId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        RoleType roleType;

        try {
            roleType = RoleType.valueOf(roleName.name());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_AUTH);
        }

        Role role = roleRepository.findById(roleType)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCESS_NOT_FOUND));

        if (!user.getRoleTypes().contains(roleType)) {
            throw new BusinessException(ErrorCode.ACCESS_NOT_FOUND);
        }

        user.deleteRole(role);
        userRepository.flush();

        if (user.getUserRoles().isEmpty()) {
            user.addRole(roleRepository.getReferenceById(RoleType.USER));
        }

        return ResponseDto.success("권한이 제거되었습니다.");
    }
}
