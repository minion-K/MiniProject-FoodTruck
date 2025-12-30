package org.example.foodtruckback.security.util;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.repository.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component("authz")
public class AuthorizationChecker {
    private final UserRepository userRepository;

    public boolean isUserAuthor(String loginId, Authentication principal) {
        if (loginId == null || principal == null) return false;

        String login = principal.getName();

        User user = userRepository.findByLoginId(loginId).orElse(null);

        if (user == null) return false;

        return user.getLoginId().equals(loginId);
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("로그인이 필요합니다.");
        }

        return userRepository.findByLoginId(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
    }

    public void checkManagerOrAdmin() {
        User currentUser = getCurrentUser();
        String role = currentUser.getRoleTypes().toString();

        if (!(role.equals("ADMIN") || role.equals("OWNER"))) {
            throw new AccessDeniedException("관리자 또는 트럭오너 권한이 필요합니다.");
        }

    }
}
