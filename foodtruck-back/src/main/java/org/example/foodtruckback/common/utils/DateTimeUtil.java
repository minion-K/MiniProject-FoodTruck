package org.example.foodtruckback.common.utils;

import java.time.*;
import java.time.format.DateTimeFormatter;

public class DateTimeUtil {
    public static final ZoneId ZONE_KST = ZoneId.of("Asia/Seoul");
    public static final ZoneId ZONE_UTC = ZoneId.of("UTC");

    private static final DateTimeFormatter KST_FORMAT
            = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private static final DateTimeFormatter ISO_UTC_FORMAT
            = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    public static String toKstString(LocalDateTime utcLocalDateTime) {
        if(utcLocalDateTime == null) return null;

        ZonedDateTime zdtKst = utcLocalDateTime
                .atZone(ZONE_UTC)
                .withZoneSameInstant(ZONE_KST);

        return zdtKst.format(KST_FORMAT);
    }

    public static String toKstString(Instant utcLocalDateTime) {
        if(utcLocalDateTime == null) return null;

        ZonedDateTime zdtKst = utcLocalDateTime
                .atZone(ZONE_UTC)
                .withZoneSameInstant(ZONE_KST);

        return zdtKst.format(KST_FORMAT);
    }

    public static String toUtcIsoString(LocalDateTime utcLocalDateTime) {
        if (utcLocalDateTime == null) return null;

        OffsetDateTime odt = utcLocalDateTime.atOffset(ZoneOffset.UTC);

        return ISO_UTC_FORMAT.format(odt);
    }

    public static LocalDateTime kstToUtc(LocalDateTime kstDateTime) {
        if (kstDateTime == null) return null;

        return kstDateTime
                .atZone(ZONE_KST)
                .withZoneSameInstant(ZONE_UTC)
                .toLocalDateTime();
    }

    public static LocalDateTime kstStringToUtc(String kstString) {
        if(kstString == null) return null;

        LocalDateTime kstLocalDateTime = LocalDateTime.parse(kstString, KST_FORMAT);

        return kstLocalDateTime
                .atZone(ZONE_KST)
                .withZoneSameInstant(ZONE_UTC)
                .toLocalDateTime();
    }

    public static LocalDateTime nowUtc() {
        return LocalDateTime.now(ZONE_UTC);
    }

    public static LocalDateTime nowKst() {
        return LocalDateTime.now(ZONE_KST);
    }
}
