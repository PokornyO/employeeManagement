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
import upce.backend.dto.auth.PasswordChangeRequest;
import upce.backend.dto.auth.ResetPasswordRequest;
import upce.backend.entity.AppUser;
import upce.backend.repository.AppUserRepository;
import upce.backend.security.JwtIssuer;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PasswordControllerTest {

    @Autowired
    private MockMvc api;

    @Autowired
    private JwtIssuer jwtIssuer;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private ObjectMapper objectMapper;

    private AppUser appUser;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();

        appUser = new AppUser();
        appUser.setUsername("testUser");
        appUser.setEmail("testuser@example.com");
        appUser.setPassword(passwordEncoder.encode("oldPassword"));
        appUserRepository.save(appUser);
    }

    @AfterEach
    void tearDown() {
        appUserRepository.deleteAll();
    }

    @Test
    void testResetPasswordSuccess() throws Exception {
        String validToken = jwtIssuer.issuePasswordResetToken(appUser.getId());

        ResetPasswordRequest request = ResetPasswordRequest.builder()
                .token(validToken)
                .newPassword("newSecurePassword0*")
                .build();

        String requestBody = objectMapper.writeValueAsString(request);

        api.perform(post("/password/reset")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());
    }

    @Test
    void testResetPasswordFailureInvalidToken() throws Exception {
        String invalidToken = "invalidToken";

        ResetPasswordRequest request = ResetPasswordRequest.builder()
                .token(invalidToken)
                .newPassword("newSecurePassword0*")
                .build();

        String requestBody = objectMapper.writeValueAsString(request);

        api.perform(post("/password/reset")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized());
    }

    @WithMockUser(roles = "EMPLOYEE", username = "testUser")
    @Test
    void testChangePasswordSuccess() throws Exception {

        PasswordChangeRequest request = PasswordChangeRequest.builder()
                .oldPassword("oldPassword")
                .newPassword("newSecurePassword0*")
                .build();

        String requestBody = objectMapper.writeValueAsString(request);

        api.perform(post("/password/change")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());
    }

    @WithMockUser(roles = "EMPLOYEE", username = "testUser")
    @Test
    void testChangePasswordFailureBadCredentials() throws Exception {

        PasswordChangeRequest request = PasswordChangeRequest.builder()
                .oldPassword("badPassword")
                .newPassword("newSecurePassword0*")
                .build();

        String requestBody = objectMapper.writeValueAsString(request);

        api.perform(post("/password/change")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Old password does not match"));
    }
}

