package upce.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import upce.backend.dto.auth.LoginRequest;
import upce.backend.dto.auth.RegisterRequest;
import upce.backend.entity.AppUser;
import upce.backend.entity.Role;
import upce.backend.repository.AppUserRepository;
import upce.backend.repository.RoleRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc api;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();

        AppUser appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setPassword(passwordEncoder.encode("Passw0rd*"));
        appUser.setEmail("testEmail@test.com");

        Role role = new Role();
        role.setName("ROLE_EMPLOYEE");
        roleRepository.save(role);

        appUser.setRole(role);
        appUserRepository.save(appUser);
    }

    @AfterEach
    void tearDown() {
        appUserRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    void testLoginSuccess() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("username")
                .password("Passw0rd*")
                .build();

        String requestBody = objectMapper.writeValueAsString(loginRequest);

        api.perform(post("/auth/login")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("username"))
                .andExpect(jsonPath("$.role").value("ROLE_EMPLOYEE"))
                .andExpect(jsonPath("$.email").value("testEmail@test.com"));
    }

    @Test
    void testLoginFailure() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("username")
                .password("wrongPassw0rd*")
                .build();

        String requestBody = objectMapper.writeValueAsString(loginRequest);

        api.perform(post("/auth/login")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @WithMockUser(roles = "ADMIN")
    @Test
    void testRegisterSuccess() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("newUser")
                .password("newPassw0rd*")
                .email("newUser@test.com")
                .firstName("New")
                .surname("User")
                .phoneNumber("987654321")
                .build();

        String requestBody = objectMapper.writeValueAsString(registerRequest);

        api.perform(post("/auth/register")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newUser"))
                .andExpect(jsonPath("$.email").value("newUser@test.com"))
                .andExpect(jsonPath("$.firstName").value("New"))
                .andExpect(jsonPath("$.surname").value("User"))
                .andExpect(jsonPath("$.phoneNumber").value("987654321"))
                .andExpect(jsonPath("$.role").value("ROLE_EMPLOYEE"));
    }

    @WithMockUser(roles = "ADMIN")
    @Test
    void testRegisterFailureUsernameAlreadyExists() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("username")
                .password("newPassw0rd*")
                .email("newUser@test.com")
                .firstName("New")
                .surname("User")
                .phoneNumber("987654321")
                .build();

        String requestBody = objectMapper.writeValueAsString(registerRequest);

        api.perform(post("/auth/register")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Username already exists"));
    }

    @WithMockUser(roles = "ADMIN")
    @Test
    void testRegisterFailureEmailNotValid() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("username")
                .password("newPassw0rd*")
                .email("justEmail")
                .firstName("New")
                .surname("User")
                .phoneNumber("987654321")
                .build();

        String requestBody = objectMapper.writeValueAsString(registerRequest);

        api.perform(post("/auth/register")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("email: Email should be valid"));
    }
}
