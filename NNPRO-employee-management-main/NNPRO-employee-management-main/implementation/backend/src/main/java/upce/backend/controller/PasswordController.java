package upce.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import upce.backend.dto.auth.PasswordChangeRequest;
import upce.backend.dto.auth.ResetPasswordRequest;
import upce.backend.dto.auth.ResetTokenRequest;
import upce.backend.service.PasswordService;

@RestController
@RequestMapping("/password")
@AllArgsConstructor
@Tag(name = "Password Management", description = "Endpoints for password changes and resets")
public class PasswordController {

    private final PasswordService passwordService;

    @Operation(summary = "Change password", description = "Allows an authenticated user to change their password")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    @PostMapping("/change")
    public ResponseEntity<String> changePassword(@RequestBody @Validated PasswordChangeRequest passwordChangeRequest) {
        passwordService.changePassword(passwordChangeRequest.getOldPassword(), passwordChangeRequest.getNewPassword());
        return ResponseEntity.ok("Password has been successfully changed");
    }

    @Operation(summary = "Send reset token", description = "Generates and sends a password reset token to the user's email")
    @PostMapping("/sendResetToken")
    public ResponseEntity<String> sendResetToken(@RequestBody @Validated ResetTokenRequest resetTokenRequest) {
        passwordService.sendResetToken(resetTokenRequest.getUsername());
        return ResponseEntity.ok("Token has been sent to the users email");
    }

    @Operation(summary = "Reset password", description = "Resets the user's password using a valid reset token")
    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody @Validated ResetPasswordRequest resetPasswordRequest) {
        passwordService.resetPassword(resetPasswordRequest.getToken(), resetPasswordRequest.getNewPassword());
        return ResponseEntity.ok("Password has been reset successfully");
    }
}
