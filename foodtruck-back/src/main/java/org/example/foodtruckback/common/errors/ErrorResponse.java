package org.example.foodtruckback.common.errors;

import java.util.List;

public record ErrorResponse(
        String code,
        String reason,
        List<FieldErrorItem> errors
) {
    public static ErrorResponse of(String code, String reason) {
        return new ErrorResponse(code, reason, List.of());
    }

    public static ErrorResponse of(String code, String reason, List<FieldErrorItem> errors) {
        return new ErrorResponse(code, reason, errors != null ? errors : List.of());
    }
}
