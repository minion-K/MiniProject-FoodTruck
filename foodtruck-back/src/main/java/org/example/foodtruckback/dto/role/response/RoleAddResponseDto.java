package org.example.foodtruckback.dto.role.response;


import jakarta.validation.Valid;
import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.role.request.RoleAddRequestDto;
import org.example.foodtruckback.entity.user.Role;
import org.example.foodtruckback.security.user.UserPrincipal;

public record RoleAddResponseDto(
        RoleType Name
) {
    public static RoleAddResponseDto from(Role role) {
        return new RoleAddResponseDto(
                role.getName()
        );
    }

}
