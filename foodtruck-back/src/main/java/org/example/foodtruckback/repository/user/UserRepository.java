package org.example.foodtruckback.repository.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.example.foodtruckback.common.enums.AuthProvider;
import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.common.enums.UserStatus;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.security.user.UserPrincipalMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("""
        select distinct u
        from User u
        left join fetch u.userRoles ur
        left join fetch ur.role r
        where u.id = :id
    """)
    Optional<User> findByIdWithRoles(@Param("id") Long id);

    Optional<User> findByEmail(@NotBlank(message = "이메일은 필수입니다.") @Size(max = 255) String email);

    Optional<User> findByLoginId(@NotBlank(message = "아이디는 필수입니다.") String LoginId);

    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);

    @Query("""
        SELECT u
        FROM User u
        JOIN u.userRoles r
        WHERE r.role.name = :roleType
        ORDER BY u.id
    """)
    Page<User> findAllByRole(@Param("roleType") RoleType roleType, Pageable pageable);

    @Query("""
        SELECT u
        FROM User u
        JOIN u.userRoles r
        WHERE r.role.name = :roleType
            AND (:keyword IS NULL OR u.name LIKE %:keyword% OR u.email LIKE %:keyword%)
            AND (:status IS NULL OR u.status = :status)
        ORDER BY
            CASE WHEN :sortKey = 'email' THEN u.email END ASC,
            CASE WHEN :sortKey = 'createdAt' THEN u.createdAt END DESC
    """)
    Page<User> findAllByRoleWithFilter(RoleType roleType, Pageable pageable, String keyword, UserStatus status, String sortKey);
}
