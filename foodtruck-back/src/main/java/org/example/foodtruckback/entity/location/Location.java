package org.example.foodtruckback.entity.location;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "locations",
        indexes = @Index(name = "idx_locations_geo", columnList = "latitude, longitude")
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Location {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "latitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "created_at", nullable = false , columnDefinition = "DATETIME(6)")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Builder
    public Location(String name, String address, BigDecimal latitude, BigDecimal longitude) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = LocalDateTime.now();
    }

    public void updatedLocation(String name, String address, BigDecimal latitude, BigDecimal longitude) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}