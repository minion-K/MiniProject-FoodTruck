package org.example.foodtruckback.repository.user;

import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.entity.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, RoleType> {
}
