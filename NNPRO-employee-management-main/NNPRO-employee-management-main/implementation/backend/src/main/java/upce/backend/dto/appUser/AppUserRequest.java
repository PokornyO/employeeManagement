package upce.backend.dto.appUser;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppUserRequest {

    @NotNull(message = "Username cannot be null.")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters.")
    private String username;

    @NotNull(message = "Password cannot be null.")
    @Size(min = 6, message = "Password must be at least 6 characters.")
    private String password;

    @NotNull(message = "Email cannot be null.")
    @Email(message = "Email should be valid.")
    private String email;

    @NotNull(message = "Role cannot be null.")
    private String role;

    @NotNull(message = "First name cannot be null.")
    @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters.")
    private String firstName;

    @NotNull(message = "Surname cannot be null.")
    @Size(min = 1, max = 50, message = "Surname must be between 1 and 50 characters.")
    private String surname;

    @Size(max = 15, message = "Phone number should not exceed 15 characters.")
    private String phoneNumber;
}
