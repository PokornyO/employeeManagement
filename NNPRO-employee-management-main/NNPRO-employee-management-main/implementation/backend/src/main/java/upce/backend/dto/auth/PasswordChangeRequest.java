package upce.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PasswordChangeRequest {

    @NotBlank(message = "Old password is mandatory")
    private String oldPassword;

    @NotBlank(message = "New password is mandatory")
    @Size(min = 8, message = "New password must be at least 8 characters long")
    @Pattern(regexp = ".*[A-Z].*", message = "New password must contain at least one uppercase letter")
    @Pattern(regexp = ".*[0-9].*", message = "New password must contain at least one number")
    @Pattern(regexp = ".*[!@#$%^&*].*", message = "New password must contain at least one special character (!@#$%^&*)")
    private String newPassword;
}
