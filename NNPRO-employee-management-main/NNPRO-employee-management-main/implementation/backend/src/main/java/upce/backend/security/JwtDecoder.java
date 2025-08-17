package upce.backend.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtDecoder {

    private final JwtProperties properties;

    public DecodedJWT decode(String token) {

        return JWT.require(Algorithm.HMAC256(properties.getSecretKey()))
                .build()
                .verify(token);
    }

    public boolean validatePasswordResetToken(String token) {
        try {
            DecodedJWT decodedJWT = decode(token);
            String purpose = decodedJWT.getClaim("purpose").asString();
            return "reset_password".equals(purpose);
        } catch (JWTVerificationException e) {
            return false;
        }
    }

}
