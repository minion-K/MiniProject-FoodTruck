package org.example.foodtruckback.common.errors;

public record FieldErrorItem(
        String filed,
        String rejected,
        String message
) {
}
