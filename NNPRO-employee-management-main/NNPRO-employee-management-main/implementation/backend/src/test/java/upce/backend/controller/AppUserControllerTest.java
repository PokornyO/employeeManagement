package upce.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import upce.backend.dto.appUser.AppUserRequest;
import upce.backend.entity.AppUser;
import upce.backend.entity.Project;
import upce.backend.entity.Role;
import upce.backend.entity.Task;
import upce.backend.repository.AppUserRepository;
import upce.backend.repository.ProjectRepository;
import upce.backend.repository.RoleRepository;
import upce.backend.repository.TaskRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AppUserControllerTest {

    @Autowired
    private MockMvc api;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private ObjectMapper objectMapper;
    private AppUser appUser;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();

        appUser = new AppUser();
        appUser.setUsername("username");
        appUser.setEmail("testEmail@test.com");

        Role role = new Role();
        role.setName("ROLE_EMPLOYEE");
        roleRepository.save(role);

        appUser.setRole(role);
        appUserRepository.save(appUser);

        AppUser user = new AppUser();
        user.setUsername("leaderUse");
    }

    @AfterEach
    void tearDown() {
        appUserRepository.deleteAll();
        roleRepository.deleteAll();
        projectRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testFindAppUsers() throws Exception {
        api.perform(get("/appusers")
                        .param("page", String.valueOf(0))
                        .param("size", String.valueOf(2))
                        .param("Sort", "username")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @WithMockUser(roles = "ADMIN")
    @Test
    void testCreateAppUser() throws Exception {
        AppUserRequest appUserRequest = AppUserRequest.builder()
                .username("testUser")
                .password("testPassword")
                .email("testemail@test.com")
                .role("ROLE_EMPLOYEE")
                .firstName("testName")
                .surname("testSurname")
                .phoneNumber("777777777")
                .build();

        String requestBody = objectMapper.writeValueAsString(appUserRequest);
        api.perform(post("/appusers")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());

        AppUser savedUser = appUserRepository.findByUsername("testUser");
        assertNotNull(savedUser);
        assertEquals("testemail@test.com", savedUser.getEmail());
        assertEquals("777777777", savedUser.getPhoneNumber());
    }

    @WithMockUser(roles = "ADMIN")
    @Test
    void testUpdateAppUser() throws Exception {
        AppUserRequest appUserRequest = AppUserRequest.builder()
                .username("updatedUser")
                .password("updatedPassword")
                .email("updatedEmail@test.com")
                .role("ROLE_EMPLOYEE")
                .firstName("updatedName")
                .surname("updatedSurname")
                .phoneNumber("888888888")
                .build();

        String updateRequestBody = objectMapper.writeValueAsString(appUserRequest);
        api.perform(put("/appusers/{id}", appUser.getId())
                        .content(updateRequestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        AppUser updatedUser = appUserRepository.findByUsername("updatedUser");
        assertNotNull(updatedUser);
        assertEquals("updatedEmail@test.com", updatedUser.getEmail());
        assertEquals("updatedName", updatedUser.getFirstName());
        assertEquals("888888888", updatedUser.getPhoneNumber());
    }

    @WithMockUser(roles = "ADMIN")
    @Test
    void testDeleteAppUser() throws Exception {
        api.perform(delete("/appusers/{id}", appUser.getId()))
                .andExpect(status().isNoContent());

        AppUser deletedUser = appUserRepository.findByUsername("deleteUser");
        assertNull(deletedUser);
    }

    @WithMockUser(username = "leader")
    @Test
    void testAddTaskToUser() throws Exception {
        AppUser leader = new AppUser();
        leader.setUsername("leader");
        leader.setEmail("testuser@example.com");
        appUserRepository.save(leader);

        Project project = new Project();
        project.setName("Test Project");
        project.setLeader(leader);
        projectRepository.save(project);

        Task task = new Task();
        task.setTitle("Test Task");
        task.setProject(project);
        taskRepository.save(task);

        AppUser userForTask = new AppUser();
        userForTask.setUsername("userForTask");
        userForTask.setEmail("taskuser@test.com");
        userForTask.getAppuserProjects().add(project);
        appUserRepository.save(userForTask);



        api.perform(post("/appusers/{appUserId}/tasks/{taskId}/assign", userForTask.getId(), task.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());

        AppUser updatedAppUser = appUserRepository.findById(userForTask.getId()).orElse(null);
        assertNotNull(updatedAppUser);
        assertEquals(updatedAppUser.getTasks().getFirst().getId(), task.getId());
    }

    @WithMockUser(username = "leaderUser")
    @Test
    void testAddUserToProject() throws Exception {
        AppUser leader = new AppUser();
        leader.setUsername("leaderUser");
        appUserRepository.save(leader);

        Project project = new Project();
        project.setName("Test Project");
        project.setLeader(leader);
        projectRepository.save(project);

        AppUser userToAdd = new AppUser();
        userToAdd.setUsername("userToAdd");
        userToAdd.setEmail("usertoadd@test.com");
        appUserRepository.save(userToAdd);

        api.perform(post("/appusers/{userId}/projects/{projectId}/assign", userToAdd.getId(), project.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());

        AppUser updatedUser = appUserRepository.findById(userToAdd.getId()).orElse(null);
        assertNotNull(updatedUser);

        Page<Project> projects = projectRepository.findAppUserProjects(updatedUser.getId(), Pageable.unpaged());
        assertTrue(projects.getSize() > 0);
    }

    @WithMockUser(roles = "LEADER", username = "leaderUser")
    @Test
    void testAddUserToProjectWhenUserIsAlreadyMebmer() throws Exception {
        AppUser leader = new AppUser();
        leader.setUsername("leaderUser");
        appUserRepository.save(leader);

        Project project = new Project();
        project.setName("Test Project");
        project.setLeader(leader);
        projectRepository.save(project);

        AppUser userToAdd = new AppUser();
        userToAdd.setUsername("userToAdd");
        userToAdd.setEmail("usertoadd@test.com");
        userToAdd.getAppuserProjects().add(project);
        appUserRepository.save(userToAdd);

        api.perform(post("/appusers/{userId}/projects/{projectId}/assign", userToAdd.getId(), project.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict());
    }

    @WithMockUser(roles = "LEADER", username = "leaderUser")
    @Test
    void testRemoveUserFromProject() throws Exception {
        AppUser leader = new AppUser();
        leader.setUsername("leaderUser");
        appUserRepository.save(leader);

        Project project = new Project();
        project.setName("Test Project");
        project.setLeader(leader);
        projectRepository.save(project);

        AppUser userToRemove = new AppUser();
        userToRemove.setUsername("userToRemove");
        userToRemove.setEmail("usertoremove@test.com");
        appUserRepository.save(userToRemove);

        userToRemove.getAppuserProjects().add(project);
        appUserRepository.save(userToRemove);

        api.perform(post("/appusers/{userId}/projects/{projectId}/remove", userToRemove.getId(), project.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        AppUser updatedUser = appUserRepository.findById(userToRemove.getId()).orElse(null);
        assertNotNull(updatedUser);

        Page<Project> projects = projectRepository.findAppUserProjects(updatedUser.getId(), Pageable.unpaged());
        assertEquals(0, projects.getSize());
    }

    @WithMockUser(roles = "ADMIN")
    @Test
    void testCreateAppUserValidationError() throws Exception {
        AppUserRequest appUserRequest = AppUserRequest.builder()
                .username("testUser")
                .password("")
                .email("testemail@test.com")
                .role("ROLE_EMPLOYEE")
                .firstName("testName")
                .surname("testSurname")
                .phoneNumber("777777777")
                .build();

        String requestBody = objectMapper.writeValueAsString(appUserRequest);
        api.perform(post("/appusers")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}