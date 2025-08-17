package upce.backend.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;



@Component
@RequiredArgsConstructor
public class JwtIssuer {

    private final JwtProperties properties;

    public String issue(Long id) {
        long expirationDays = Long.parseLong(properties.getTokenExpirationTime());

        return JWT.create()
                .withSubject(String.valueOf(id))
                .withExpiresAt(Instant.now().plus(Duration.ofDays(expirationDays)))
                .sign(Algorithm.HMAC256(properties.getSecretKey()));
    }
    public String issuePasswordResetToken(Long id) {
        long expirationMinutes = Long.parseLong(properties.getPasswordResetTokenExpirationTime());

        return JWT.create()
                .withSubject(String.valueOf(id))
                .withExpiresAt(Instant.now().plus(Duration.ofMinutes(expirationMinutes)))
                .withClaim("purpose", "reset_password")
                .sign(Algorithm.HMAC256(properties.getSecretKey()));
    }
}
