package org.example.foodtruckback.entity.user;

import jakarta.persistence.*;
import lombok.*;
import org.example.foodtruckback.common.enums.AuthProvider;
import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.common.enums.UserStatus;
import org.example.foodtruckback.entity.base.BaseTimeEntity;

import java.security.Provider;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_login_id", columnNames = "login_id"),
                @UniqueConstraint(name = "uk_users_email", columnNames = "email"),
        }
)
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Column(name = "login_id", length = 50, nullable = false)
    private String loginId;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "verified", nullable = false)
    private boolean verified = false;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private UserStatus status = UserStatus.TEMP;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserRole> userRoles = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", length = 20, nullable = false)
    private AuthProvider provider;

    @Column(name = "provider_id", length = 100)
    private String providerId;

    public static User createTempUser(String email) {
        User user = new User();
        String suffix = "_" + System.currentTimeMillis();

        user.email = email;
        user.status = UserStatus.TEMP;

        user.name = "TEMP" + suffix;
        user.loginId = "TEMP" + suffix;
        user.password = "TEMP" + suffix;
        user.provider = AuthProvider.LOCAL;

        return user;
    }

    public static User createOauthUser (
            AuthProvider provider,
            String providerId,
            String email,
            String name
    ) {
        User user = new User();

        user.loginId = provider.name() + "_" + providerId;
        user.password = UUID.randomUUID().toString();
        user.email = email;
        user.name = name;
        user.provider = provider;
        user.providerId = providerId;
        user.verified = true;
        user.status = UserStatus.ACTIVE;

        return user;
    }

    public void connectProvider(AuthProvider provider, String providerId) {
        this.provider = provider;
        this.providerId = providerId;
    }

    public void updateOauthProfile(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public void completeSignup(String name, String loginId, String password, String phone) {
        this.name = name;
        this.loginId = loginId;
        this.password = password;
        this.phone = phone;
        this.status = UserStatus.ACTIVE;
    }

    public void grantRole(Role role) {
        boolean exists = userRoles.stream()
                .anyMatch(userRole -> userRole.getRole().equals(role));

        if(!exists) {
            userRoles.add(new UserRole(this, role));
        }
    }

    public void addRole(Role role) {
        boolean exists = userRoles.stream().anyMatch(ur -> ur.getRole().equals(role));

        if (!exists) {
            userRoles.add(new UserRole(this, role));
        }
    }

    public void deleteRole(Role role) {
        userRoles.removeIf(ur -> ur.getRole().equals(role));
    }

    public Set<RoleType> getRoleTypes() {
        return userRoles.stream()
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toUnmodifiableSet());
    }

    public void changePassword(String password) {
        this.password = password;
    }

    public void verifyEmail() {
        this.verified = true;
    }

}
