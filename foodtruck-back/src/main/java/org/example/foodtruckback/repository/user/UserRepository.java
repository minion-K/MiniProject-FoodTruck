package org.example.foodtruckback.repository.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.example.foodtruckback.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("""
        select distinct u
        from User u
        left join fetch u.userRoles ur
        left join fetch ur.role r
        where u.loginId = :loginId
    """)
    Optional<User> findWithRoleByLoginId(@Param("loginId") String loginId);

    Optional<User> findByEmail(@NotBlank(message = "이메일은 필수입니다.") @Size(max = 255) String email);

    Optional<User> findByLoginId(@NotBlank(message = "아이디는 필수입니다.") String LoginId);
}
