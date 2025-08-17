package upce.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import upce.backend.dto.auth.LoginRequest;
import upce.backend.dto.auth.LoginResponse;
import upce.backend.dto.auth.RegisterRequest;
import upce.backend.service.AuthService;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Login user", description = "Authenticates a user and returns a JWT token")
    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Validated LoginRequest loginRequest) {
        return authService.login(loginRequest.getUsername(), loginRequest.getPassword());
    }

    @Operation(summary = "Register user", description = "Registers a new user in the system")
    @PostMapping("/register")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public LoginResponse register(@RequestBody @Validated RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }
}
