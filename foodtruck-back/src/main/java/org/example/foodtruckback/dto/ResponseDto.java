package org.example.foodtruckback.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.nimbusds.jwt.util.DateUtils;
import lombok.Builder;
import lombok.Getter;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.utils.DateTimeUtil;

import java.awt.*;
import java.time.Instant;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseDto<T> {
    private final boolean success;
    private final String message;
    private final T data;
    private final String timestamp;

    private Integer status;
    private final String code;

    @Builder
    private ResponseDto(
            boolean success,
            String message,
            T data,
            String timestamp,
            Integer status,
            String code
    ) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
        this.status = status;
        this.code = code;
    }

    public static <T> ResponseDto<T> success(String message, T data) {
        return ResponseDto.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .status(200)
                .timestamp(DateTimeUtil.toKstString(Instant.now()))
                .build();
    }

    public static <T> ResponseDto<T> success(String message) {
        return ResponseDto.<T>builder()
                .success(true)
                .message(message)
                .status(200)
                .timestamp(DateTimeUtil.toKstString(Instant.now()))
                .build();
    }

    public static <T> ResponseDto<T> success(T data) {
        return ResponseDto.<T>builder()
                .success(true)
                .message("success")
                .data(data)
                .status(200)
                .timestamp(DateTimeUtil.toKstString(Instant.now()))
                .build();
    }

    public static <T> ResponseDto<T> failure(String message) {
        return ResponseDto.<T>builder()
                .success(false)
                .message(message)
                .status(400)
                .timestamp(DateTimeUtil.toKstString(Instant.now()))
                .build();
    }

    public static <T> ResponseDto<T> failure(String message, Integer httpStatus) {
        return ResponseDto.<T>builder()
                .success(false)
                .message(message)
                .status(httpStatus)
                .timestamp(DateTimeUtil.toKstString(Instant.now()))
                .build();
    }

    public static <T> ResponseDto<T> failure(String message, Integer httpStatus, String code) {
        return ResponseDto.<T>builder()
                .success(false)
                .message(message)
                .status(httpStatus)
                .code(code)
                .timestamp(DateTimeUtil.toKstString(Instant.now()))
                .build();
    }

    public static <T> ResponseDto<T> failure(ErrorCode errorCode) {
        return ResponseDto.<T>builder()
                .success(false)
                .message(errorCode.getMessage())
                .status(errorCode.getStatus().value())
                .code(errorCode.getCode())
                .timestamp(DateTimeUtil.toKstString(Instant.now()))
                .build();
    }
}
