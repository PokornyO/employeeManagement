package upce.backend.dto.appUser;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AppUserResponse {
    private Long id;

    private String username;

    private String email;

    private String firstName;

    private String surname;

    private String phoneNumber;

    private String role;
}
