package org.example.foodtruckback.repository.user;

import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.entity.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, RoleType> {
    Optional<Role> findByName(RoleType roleType);
}
