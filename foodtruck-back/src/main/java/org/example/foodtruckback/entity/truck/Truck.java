package org.example.foodtruckback.entity.truck;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.foodtruckback.common.enums.TruckStatus;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.entity.base.BaseTimeEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "trucks",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_trucks_owner_name",
                columnNames = {"owner_id", "name"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Truck extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_trucks_owner_id"))
    private User owner;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String cuisine;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TruckStatus status = TruckStatus.INACTIVE;

    @OneToMany(mappedBy = "truck", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MenuItem> menus = new ArrayList<>();

    @OneToMany(mappedBy = "truck", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Schedule> schedules = new ArrayList<>();

    public Truck(User owner, String name, String cuisine) {
        this.owner = owner;
        this.name = name;
        this.cuisine = cuisine;
    }

    public void update(String name, String cuisine, TruckStatus status) {
        if (name != null && !name.isBlank()) this.name = name;
        if (cuisine != null && !cuisine.isBlank()) this.cuisine = cuisine;
    }

    public void activate() {
        this.status = TruckStatus.ACTIVE;
    }

    public void inactivate() {
        this.status = TruckStatus.INACTIVE;
    }

    public void addMenu(MenuItem menu) {
        menus.add(menu);
        menu.setTruck(this);
    }

    public void addSchedule(Schedule schedule) {
        schedules.add(schedule);
        schedule.setTruck(this);
    }

    public void removeMenu(MenuItem menu) {
        menus.remove(menu);
        menu.setTruck(null);
    }
}
