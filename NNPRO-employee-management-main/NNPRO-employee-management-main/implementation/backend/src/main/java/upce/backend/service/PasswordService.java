package upce.backend.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import upce.backend.entity.AppUser;
import upce.backend.exception.InvalidTokenException;
import upce.backend.security.JwtDecoder;
import upce.backend.security.JwtIssuer;

@Service
@RequiredArgsConstructor
public class PasswordService {

    private final AppUserService appUserService;

    private final EmailService emailService;

    private final PasswordEncoder passwordEncoder;

    private final JwtIssuer jwtIssuer;

    private final JwtDecoder jwtDecoder;

    @Value("${frontend.url}")
    private String frontendUrl;

    public void changePassword(String oldPassword, String newPassword) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser appUser = appUserService.findByUsername(username);

        if (passwordEncoder.matches(oldPassword, appUser.getPassword())) {
            appUser.setPassword(passwordEncoder.encode(newPassword));
            appUserService.update(appUser);
        } else {
            throw new BadCredentialsException("Old password does not match");
        }
    }

    public void sendResetToken(String username) {
        AppUser appUser = appUserService.findByUsername(username);
        String token = jwtIssuer.issuePasswordResetToken(appUser.getId());
        String resetLink = frontendUrl + "/password-reset?token=" + token;
        emailService.sendResetToken(appUser.getEmail(), resetLink);
    }

    public void resetPassword(String token, String newPassword) {
        if (jwtDecoder.validatePasswordResetToken(token)) {
            DecodedJWT decodedJWT = jwtDecoder.decode(token);
            Long userId = Long.parseLong(decodedJWT.getSubject());
            AppUser appUser = appUserService.findById(userId);
            appUser.setPassword(passwordEncoder.encode(newPassword));
            appUserService.update(appUser);
        } else {
            throw new InvalidTokenException("Invalid or expired password reset token");
        }
    }
}
