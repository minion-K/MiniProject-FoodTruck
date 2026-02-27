package org.example.foodtruckback.entity.reservation;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.foodtruckback.entity.truck.MenuItem;

@Entity
@Table(name = "reservation_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReservationItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_id", foreignKey = @ForeignKey(name = "fk_reservation_item_reservation"))
    private Reservation reservation;

    @Column(name = "menu_item_id", nullable = false)
    private Long menuItemId;

    @Column(nullable = false)
    private String menuName;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private int qty;

    public static ReservationItem create(
            Reservation reservation,
            Long menuItemId,
            String menuName,
            int price,
            int qty
    ) {
        ReservationItem item = new ReservationItem();
        item.reservation = reservation;
        item.menuItemId = menuItemId;
        item.menuName = menuName;
        item.price = price;
        item.qty = qty;

        return item;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }
}
