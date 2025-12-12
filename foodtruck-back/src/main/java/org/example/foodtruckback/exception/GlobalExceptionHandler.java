package org.example.foodtruckback.exception;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.dto.ResponseDto;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.nio.file.AccessDeniedException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    protected ResponseEntity<ResponseDto<?>> handleBusinessException(BusinessException e) {
        ErrorCode code = e.getErrorCode();

        log.warn("[BusinessException} {}", code.getMessage());

        return ResponseEntity
                .status(code.getStatus())
                .body(ResponseDto.failure(code.getMessage(), code.getStatus().value(), code.name()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ResponseDto<?>> handleMethodArgumentNotValid(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .orElse("유효성 검사 오류");

        log.warn("[Validation Error] {}", errorMessage);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ResponseDto.failure(errorMessage, HttpStatus.BAD_REQUEST.value(), ErrorCode.INVALID_INPUT.getCode()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<ResponseDto<?>> handleConstraintViolation(ConstraintViolationException e) {
        log.warn("[ConstraintViolation] {}", e.getMessage());

        return ResponseEntity
                .badRequest()
                .body(ResponseDto.failure("유효하지 않은 요청 값입니다.",
                        HttpStatus.BAD_REQUEST.value(),
                        ErrorCode.INVALID_INPUT.name()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<ResponseDto<?>> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        log.warn("[TypeMismatch] {}", e.getMessage());

        return ResponseEntity
                .badRequest()
                .body(ResponseDto.failure("잘목된 요청 파라미터 타입입니다.",
                        HttpStatus.BAD_REQUEST.value(),
                        ErrorCode.INVALID_TYPE.name()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<ResponseDto<?>> handleNotReadable(HttpMessageNotReadableException e) {
        log.warn("[NotReadable] {}", e.getMessage());

        return ResponseEntity
                .badRequest()
                .body(ResponseDto.failure("요청 데이터를 읽을 수 없습니다. JSON 형식을 확인하세요.",
                        HttpStatus.BAD_REQUEST.value(),
                        ErrorCode.INVALID_JSON.name()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    protected ResponseEntity<ResponseDto<?>> handleBadCredentials(BadCredentialsException e) {
        log.warn("[BadCredential] {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ResponseDto.failure("아이디 또는 비밀번호가 올바르지 않습니다.",
                        HttpStatus.UNAUTHORIZED.value(),
                        ErrorCode.INVALID_AUTH.name()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    protected ResponseEntity<ResponseDto<?>> handleAccessDinied(AccessDeniedException e) {
        log.warn("[AccessDenied] {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ResponseDto.failure("접근 권한이 없습니다.",
                        HttpStatus.FORBIDDEN.value(),
                        ErrorCode.ACCESS_DENIED.name()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    protected ResponseEntity<ResponseDto<?>> handleDataIntegrity(DataIntegrityViolationException e) {
        log.error("[DB Constraint] {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ResponseDto.failure("데이터 제약 조건에 위배됩니다.",
                        HttpStatus.CONTINUE.value(),
                        ErrorCode.DB_CONSTRAINT.name()));
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ResponseDto<?>> handleException(Exception e) {
        log.error("[Unknown Error]", e);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResponseDto.failure("서버에 오류가 발생했습니다.",
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        ErrorCode.INTERNAL_ERROR.name()));
    }
}
