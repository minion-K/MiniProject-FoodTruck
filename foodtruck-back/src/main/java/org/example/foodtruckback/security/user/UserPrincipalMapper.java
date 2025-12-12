package org.example.foodtruckback.security.user;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.repository.user.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserPrincipalMapper {

    private final UserRepository userRepository;

    public UserPrincipal toPrincipal(@NonNull String loginId) {

        User user = userRepository.findWithRoleByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("User not found: " + loginId));

        return map(user);
    }

    public UserPrincipal map(@NonNull User user) {

        List<SimpleGrantedAuthority> authorities =
                (user.getUserRoles() == null || user.getUserRoles().isEmpty())
                        ? List.of(new SimpleGrantedAuthority("ROLE_USER"))
                        : user.getUserRoles().stream()
                        .map(role -> {
                            String r = role.getRole().getName().name();
                            String name = r.startsWith("ROLE") ? r : "ROLE_" + r;

                            return new SimpleGrantedAuthority(name);
                        })
                        .toList();

        return  UserPrincipal.builder()
                .id(user.getId())
                .loginId(user.getLoginId())
                .password(user.getPassword())
                .authorities(authorities)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .enabled(true)
                .build();
    }
}
