package org.example.foodtruckback.common.enums;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // ===========================
    // Common Errors (Cxxx)
    // ===========================
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "C001", "잘못된 입력값입니다.", "Invalid input parameter"),
    INVALID_TYPE(HttpStatus.BAD_REQUEST, "C002", "잘못된 요청 타입입니다.", "Type mismatch"),
    INVALID_JSON(HttpStatus.BAD_REQUEST, "C003", "JSON 형식이 올바르지 않습니다.", "JSON parse error"),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C004", "지원하지 않는 HTTP 요청 방식입니다.", "HTTP method not supported"),
    ENTITY_NOT_FOUND(HttpStatus.NOT_FOUND, "C005", "데이터를 찾을 수 없습니다.", "Entity not found"),
    DB_CONSTRAINT(HttpStatus.CONFLICT, "C006", "데이터 제약 조건 위반입니다.", "Database constraint violation"),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C007", "서버 내부 오류가 발생했습니다.", "Internal server error"),

    // ===========================
    // Authentication / Token (Axxx)
    // ===========================
    INVALID_AUTH(HttpStatus.UNAUTHORIZED, "A001", "인증 정보가 올바르지 않습니다.", "Invalid credentials"),
    AUTHENTICATION_FAILED(HttpStatus.UNAUTHORIZED, "A002", "인증에 실패했습니다.", "Authentication failed"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "A003", "접근 권한이 없습니다.", "Access denied"),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "A004", "토큰이 만료되었습니다.", "Token expired"),
    TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "A005", "유효하지 않은 토큰입니다.", "Invalid token"),
    PASSWORD_CONFIRM_MISMATCH(HttpStatus.BAD_REQUEST, "A006", "비밀번호와 비밀번호 확인이 일치하지 않습니다.", "Password mismatch"),

    // ===========================
    // UserApi (Uxxx)
    // ===========================
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다.", "UserApi not found"),
    ACCESS_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "권한을 찾을 수 없습니다.", "UserApi not found"),
    DUPLICATE_USER(HttpStatus.CONFLICT, "U002", "이미 존재하는 사용자입니다.", "Duplicate user"),
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND,"U003", "존재하지 않는 ROLE입니다." ,"Role not found" ),

    // ===========================
    // location (Lxxx)
    // ===========================
    DUPLICATE_LOCATION(HttpStatus.CONFLICT, "L001", "이미 존재하는 스팟입니다.", "Duplicate location"),
    LOCATION_NOT_FOUND(HttpStatus.NOT_FOUND, "L002", "스팟을 찾을 수 없습니다.", "LocationApi not found"),

    // ===========================
    // email (Exxx)
    // ===========================
    EMAIL_NOT_VERIFIED(HttpStatus.FORBIDDEN, "E001", "이메일 인증이 필요합니다.", "Email not verified"),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "E002", "이미 존재하는 이메일입니다.", "Duplicate email"),
    EMAIL_CHANGE_VERIFY_REQUIRED(HttpStatus.FORBIDDEN, "E003", "이메일 변경을 위한 인증이 필요합니다.", "Email change verified required"),
    INVALID_EMAIL_CHANGE_TOKEN(HttpStatus.BAD_REQUEST, "E004", "이메일 변경 토큰이 유효하지 않습니다.", "Invalid email change token"),
    EMAIL_CHANGE_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "E005", "이메일 변경 토근이 만료되었습니다.", "Email change token expired"),


    // ===========================
    // schedule (Sxxx)
    // ===========================
    SCHEDULE_NOT_FOUND(HttpStatus.NOT_FOUND, "S001", "해당 스케줄을 찾을 수 없습니다.", "Schedule not found"),
    INVALID_SCHEDULE(HttpStatus.BAD_REQUEST, "S002", "예약할 수 없는 스케줄입니다.", "Invalid schedule"),

    // ===========================
    // reservation (Rxxx)
    // ===========================
    DUPLICATE_RESERVATION(HttpStatus.CONFLICT, "R001", "이미 예약된 픽업시간입니다.", "Duplicate reservation"),
    RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND, "R002", "해당 예약을 찾을 수 없습니다.", "Reservation not found"),
    INVALID_RESERVATION_STATUS(HttpStatus.BAD_REQUEST, "R003", "현재 예약 상태로는 수행할 수 없는 요청입니다.", "Invalid reservation status"),

    // ===========================
    // menu (Mxxx)
    // ===========================
    MENU_NOT_FOUND(HttpStatus.NOT_FOUND, "M001", "메뉴를 찾을 수 없습니다.", "Menu not found"),
    INVALID_MENU(HttpStatus.BAD_REQUEST, "M002", "해당 트럭의 메뉴가 아닙니다.", "Invalid menu this truck"),
    MENU_SOLD_OUT(HttpStatus.CONFLICT, "M003", "해당 메뉴는 품절 상태입니다.", "Menu is Sold out"),

    // ===========================
    // truck (Txxx)
    // ===========================
    TRUCK_NOT_FOUND(HttpStatus.NOT_FOUND, "T001", "해당 트럭을 찾을 수 없습니다.", "Truck not found"),

    // ===========================
    // payment (Pxxx)
    // ===========================
    PAYMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "결제 내역을 찾을 수 없습니다.", "Payment not found"),
    PAYMENT_ALREADY_PROCESSED(HttpStatus.BAD_REQUEST, "P002", "이미 처리된 결제입니다.", "Payment already processed"),
    PAYMENT_POINT_MISMATCH(HttpStatus.BAD_REQUEST, "P003", "결제 금액이 요청과 일치하지 않습니다.", "Payment amount mismatch"),
    PAYMENT_REFUND_ALREADY_PROCESSED(HttpStatus.BAD_REQUEST, "P004", "이미 처리된 환불 요청입니다.", "Refund already processed"),
    PAYMENT_REFUNDED_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "P005", "해당 결제는 환불할 수 없습니다.", "Payment cannot be refunded"),
    PAYMENT_REFUNDED_AMOUNT_INVALID(HttpStatus.BAD_REQUEST, "P006", "환불 금액이 올바르지 않습니다.", "Invalid refund amount"),
    PAYMENT_GATEWAY_ERROR(HttpStatus.BAD_GATEWAY, "P007", "결제 대행사와 통신 중 오류가 발생했습니다.", "Payment gateway error");


    private final HttpStatus status;
    private final String code;
    private final String message;     // client-friendly
    private final String logMessage;  // developer-friendly

    ErrorCode(HttpStatus status, String code, String message, String logMessage) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.logMessage = logMessage;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s (HTTP %d)", code, logMessage, status.value());
    }
}
