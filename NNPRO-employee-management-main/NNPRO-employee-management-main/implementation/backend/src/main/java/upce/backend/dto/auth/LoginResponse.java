package upce.backend.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String accessToken;

    private Long userId;

    private String username;

    private String email;

    private String firstName;

    private String surname;

    private String phoneNumber;

    private String role;
}
