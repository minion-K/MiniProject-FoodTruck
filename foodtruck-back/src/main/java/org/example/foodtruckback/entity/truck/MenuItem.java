package org.example.foodtruckback.entity.truck;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.foodtruckback.entity.base.BaseTimeEntity;

@Entity
@Table(
        name = "menu_items",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_menu_item_truck_name",
                        columnNames = {"truck_id", "name"})
        },
        indexes = {
                @Index(name = "idx_menu_truck", columnList = "truck_id, is_sold_out")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MenuItem extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "truck_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_truck_menu_menu_item"))
    private Truck truck;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, precision = 10, scale = 2)
    private int price;

    @Column(nullable = false)
    private boolean isSoldOut = false;

    @Column(length = 255)
    private String optionText;

    public MenuItem(Truck truck, String name, int price, String optionText) {
        this.truck = truck;
        this.name = name;
        this.price = price;
        this.optionText = optionText;
        this.isSoldOut = false;
    }

    public void update(String name, Integer price, String optionText, Boolean isSoldOut ) {
        if (name != null && !name.isBlank()) this.name = name;
        if (price != null) this.price = price;
        if (optionText != null) this.optionText = optionText;
        if (isSoldOut != null) this.isSoldOut = isSoldOut;
    }

    public void setTruck(Truck truck) {
        this.truck = truck;
    }

    public void setSoldOut(Boolean soldOut) {
        this.isSoldOut = soldOut;
    }
}
