package org.example.foodtruckback.repository.auth;

import org.example.foodtruckback.entity.auth.RefreshToken;
import org.example.foodtruckback.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByUser(User user);

    void deleteByUser(User user);
}
