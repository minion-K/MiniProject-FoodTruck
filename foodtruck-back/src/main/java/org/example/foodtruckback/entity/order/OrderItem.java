package org.example.foodtruckback.entity.order;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.foodtruckback.entity.truck.MenuItem;

@Entity
@Table(
        name = "order_items",
        indexes = @Index(name = "idx_order_items_order", columnList = "order_id")

)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", foreignKey = @ForeignKey(name = "fk_order_item_order"))
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "menu_item_id", foreignKey = @ForeignKey(name = "fk_order_item_menu_item"))
    private MenuItem menuItem;

    @Column(name = "qty", nullable = false)
    private int qty;

    @Column(name = "unit_price", nullable = false)
    private int price;
}