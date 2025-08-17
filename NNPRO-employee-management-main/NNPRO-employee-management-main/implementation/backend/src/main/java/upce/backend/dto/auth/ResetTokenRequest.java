package upce.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetTokenRequest {

    @NotBlank(message = "Username is mandatory")
    private String username;
}