package org.example.foodtruckback.entity.order;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.foodtruckback.entity.truck.MenuItem;

@Entity
@Table(
        name = "order_items",
        indexes = {
            @Index(name = "idx_order_items_order", columnList = "order_id"),
            @Index(name = "idx_order_items_menu_items_id", columnList = "menu_item_id")
        }

)
@Getter
@NoArgsConstructor
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", foreignKey = @ForeignKey(name = "fk_order_item_order"))
    private Order order;

    @Column(name = "menu_item_id", nullable = false)
    private Long menuItemId;

    @Column(name = "menu_name", nullable = false)
    private String menuName;

    @Column(name = "qty", nullable = false)
    private int qty;

    @Column(name = "unit_price", nullable = false)
    private int price;

    public void setOrder(Order order) {
        this.order = order;
    }

    @Builder
    public OrderItem(Long menuItemId, String menuName, int qty, int price) {
        this.menuItemId = menuItemId;
        this.menuName = menuName;
        this.qty = qty;
        this.price = price;
    }

    public static OrderItem create(
            Long menuItemId,
            String menuName,
            int price,
            int qty
    ) {
        OrderItem orderItem = OrderItem.builder()
                .menuItemId(menuItemId)
                .menuName(menuName)
                .qty(qty)
                .price(price)
                .build();

        return orderItem;
    };
}