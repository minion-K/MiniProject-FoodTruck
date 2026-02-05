package org.example.foodtruckback.security.provider;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;

@Component
public class JwtProvider {

    public static final String BEARER_PREFIX = "Bearer ";
    public static final String CLAIM_ROLES = "roles";
    public static final String CLAIM_EMAIL = "email";
    public static final String CLAIM_TYPE = "type";
    public static final String CLAIM_USER_ID = "userId";

    private final SecretKey key;
    private final long accessExpMs;
    private final long refreshExpMs;
    private final long emailExpMs;
    private final int clockSkewSeconds;

    private final JwtParser parser;

    public JwtProvider(
            @Value("${jwt.secret}") String base64Secret,
            @Value("${jwt.expiration}") long accessExpMs,
            @Value("${jwt.refresh-expiration}") long refreshExpMs,
            @Value("${jwt.email-expiration}") long emailExpMs,
            @Value("${jwt.clock-skew-seconds:0}") int clockSkewSeconds
    ) {
        byte[] secretBytes = Decoders.BASE64.decode(base64Secret);
        if (secretBytes.length < 32) {
            throw new IllegalArgumentException("jwt.secret must be at least 256 bits (32 bytes) when Base64-decoded.");
        }
        this.key = Keys.hmacShaKeyFor(secretBytes);

        this.accessExpMs = accessExpMs;
        this.refreshExpMs = refreshExpMs;
        this.emailExpMs = emailExpMs;
        this.clockSkewSeconds = Math.max(clockSkewSeconds, 0);

        this.parser = Jwts.parserBuilder()
                .setSigningKey(this.key)
                .setAllowedClockSkewSeconds(this.clockSkewSeconds)
                .build();
    }

    // Access 토큰 생성
    public String generateAccessToken(Long userId, String username, Set<String> roles) {
        return buildToken(userId, username, roles, accessExpMs);
    }

    // Refresh 토큰 생성
    public String generateRefreshToken(Long userId, String username, Set<String> roles) {
        return buildToken(userId, username, roles, refreshExpMs);
    }

    // Email 토큰 생성
    public String generateEmailJwtToken(Long userId, String email, String type) {
        long now = System.currentTimeMillis();
        Date iat = new Date(now);
        Date exp = new Date(now + emailExpMs);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim(CLAIM_USER_ID, userId)
                .claim(CLAIM_EMAIL, email)
                .claim(CLAIM_TYPE, type)
                .setIssuedAt(iat)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Token 검증
    public boolean isValidToken(String token) {
        try {
            parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    // Email 토큰 일치 여부
    public boolean isValidEmailToken(String token, String expectedType) {
        try {
            Claims claims = parseClaimsJws(token);
            String type = claims.get(CLAIM_TYPE, String.class);
            return expectedType == null ? type != null : expectedType.equals(type);
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    // 토큰에서 Claims 반환
    public Claims getClaims(String token) {
        return parseClaimsJws(token);
    }

    // JWT 조회
    public String getSubject(String token) {
        return getClaims(token).getSubject();
    }

    // 토큰 조회
    public String getUsernameFromJwt(String token) {
        return getSubject(token);
    }

    public Long getUserIdFromJwt(String token) {
        return getClaims(token).get(CLAIM_USER_ID, Long.class);
    }

    // Email 추출
    public String getEmailFromEmailToken(String token) {
        Claims c = getClaims(token);
        String email = c.get(CLAIM_EMAIL, String.class);

        return (email != null) ? email : c.getSubject();
    }

    public Long getUserIdFromEmailToken(String token) {
        Claims c = getClaims(token);

        return c.get(CLAIM_USER_ID, Long.class);
    }

    // 토큰의 roles 클레임을 Set<String>으로 반환
    @SuppressWarnings("unchecked")
    public Set<String> getRolesFromJwt(String token) {
        Claims c = getClaims(token);
        Object raw = c.get(CLAIM_ROLES);
        if (raw == null) return Set.of();

        if (raw instanceof Collection<?> coll) {
            Set<String> result = new HashSet<>();
            for (Object o : coll) if (o != null) result.add(o.toString());
            return result;
        }
        return Set.of(raw.toString());
    }

    // 토큰의 남은 만료 시간 (ms)
    public long getRemainingMillis(String token) {
        Claims c = getClaims(token);
        Date exp = c.getExpiration();
        return (exp == null) ? -1L : (exp.getTime() - System.currentTimeMillis());
    }

    /* ============================
     * 유틸(헤더 처리 등)
     * ============================ */

    // 실제 토큰 부분 제거
    public String removeBearer(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith(BEARER_PREFIX)) {
            throw new IllegalArgumentException("Authorization 형식이 유효하지 않습니다.");
        }
        return bearerToken.substring(BEARER_PREFIX.length()).trim();
    }


    private Claims parseClaimsJws(String token) {
        JwtParser p = this.parser;
        // parser.parseClaimsJws throws various JwtException (ExpiredJwtException, MalformedJwtException, etc.)
        Jws<Claims> jws = p.parseClaimsJws(token);
        return jws.getBody();
    }

    private String buildToken(Long userId, String username, Set<String> roles, long expMs) {
        long now = System.currentTimeMillis();
        Date iat = new Date(now);
        Date exp = new Date(now + expMs);

        List<String> roleList = (roles == null) ? List.of() : new ArrayList<>(roles);

        return Jwts.builder()
                .setSubject(username)
                .claim(CLAIM_USER_ID, userId)
                .claim(CLAIM_ROLES, roleList)
                .setIssuedAt(iat)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
