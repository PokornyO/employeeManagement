package upce.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import upce.backend.dto.project.ProjectRequest;
import upce.backend.entity.AppUser;
import upce.backend.entity.Project;
import upce.backend.entity.Role;
import upce.backend.entity.Task;
import upce.backend.enums.ProjectStatus;
import upce.backend.repository.AppUserRepository;
import upce.backend.repository.ProjectRepository;
import upce.backend.repository.RoleRepository;
import upce.backend.repository.TaskRepository;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProjectControllerTest {

    @Autowired
    private MockMvc api;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    RoleRepository roleRepository;
    @Autowired
    private TaskRepository taskRepository;

    private ObjectMapper objectMapper;
    private Project project;
    private AppUser appUser;
    private Role leaderRole;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        appUser = new AppUser();
        appUser.setUsername("testUser");
        appUser.setEmail("testuser@example.com");
        leaderRole = new Role();
        leaderRole.setName("ROLE_LEADER");
        roleRepository.save(leaderRole);
        appUser.setRole(leaderRole);
        appUserRepository.save(appUser);

        project = new Project();
        project.setName("Test Project");
        project.setDescription("A test project");
        project.setDueDate(LocalDateTime.now().plusDays(10));
        project.setLeader(appUser);
        project.setStatus(ProjectStatus.PLANNED);
        projectRepository.save(project);
    }

    @AfterEach
    void tearDown() {
        appUserRepository.deleteAll();
        roleRepository.deleteAll();
        projectRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testFindAllProjects() throws Exception {
        api.perform(get("/projects")
                        .param("page", String.valueOf(0))
                        .param("size", String.valueOf(2))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @WithMockUser(roles = "LEADER")
    @Test
    void testCreateProject() throws Exception {
        projectRepository.deleteAll();
        ProjectRequest projectRequest = ProjectRequest.builder()
                .name("New Project")
                .description("Description of the new project")
                .dueDate(LocalDateTime.now().plusDays(5))
                .status("IN_PROGRESS")
                .appUserId(appUser.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(projectRequest);

        api.perform(post("/projects")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());

        Project savedProject = projectRepository.findAll().getFirst();

        assertNotNull(savedProject);
        assertEquals("New Project", savedProject.getName());
        assertEquals("Description of the new project", savedProject.getDescription());
    }

    @WithMockUser(roles = "LEADER")
    @Test
    void testUpdateProject() throws Exception {
        ProjectRequest projectRequest = ProjectRequest.builder()
                .name("Updated Project")
                .description("Updated description")
                .dueDate(LocalDateTime.now().plusDays(15))
                .status("IN_PROGRESS")
                .appUserId(appUser.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(projectRequest);
        api.perform(put("/projects/{id}", project.getId())
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Project updatedProject = projectRepository.findById(project.getId()).orElse(null);
        assertNotNull(updatedProject);
        assertEquals("Updated Project", updatedProject.getName());
        assertEquals("Updated description", updatedProject.getDescription());
    }

    @WithMockUser(roles = "LEADER")
    @Test
    void testDeleteProject() throws Exception {
        api.perform(delete("/projects/{id}", project.getId()))
                .andExpect(status().isNoContent());

        Project deletedProject = projectRepository.findById(project.getId()).orElse(null);
        assertNull(deletedProject);
    }
    @WithMockUser(roles = "LEADER")
    @Test
    void testUpdateNonExistentProject() throws Exception {
        Long nonExistentId = 999L;

        ProjectRequest projectRequest = ProjectRequest.builder()
                .name("Non-existent Project")
                .description("This project does not exist.")
                .dueDate(LocalDateTime.now().plusDays(5))
                .status("IN_PROGRESS")
                .appUserId(appUser.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(projectRequest);
        api.perform(put("/projects/{id}", nonExistentId)
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @WithMockUser(roles = "LEADER")
    @Test
    void testCreateProjectWithNonExistentUserId() throws Exception {
        Long nonExistentUserId = 999L;

        ProjectRequest projectRequest = ProjectRequest.builder()
                .name("New Project")
                .description("This project should fail creation due to non-existent user.")
                .dueDate(LocalDateTime.now().plusDays(5))
                .appUserId(nonExistentUserId)
                .status("IN_PROGRESS")
                .build();

        String requestBody = objectMapper.writeValueAsString(projectRequest);
        api.perform(post("/projects")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void testFindProjectsByAppUserIdInTasksWithMultipleProjects() throws Exception {
        AppUser anotherUser = new AppUser();
        anotherUser.setUsername("anotherUser");
        anotherUser.setEmail("anotheruser@example.com");
        appUserRepository.save(anotherUser);

        AppUser leader = new AppUser();
        leader.setUsername("Leader");
        leader.setEmail("leader@example.com");
        leader.setRole(leaderRole);
        appUserRepository.save(leader);

        Project project1 = new Project();
        project1.setName("Project 1");
        project1.setDescription("First test project");
        project1.setDueDate(LocalDateTime.now().plusDays(10));
        project1.setStatus(ProjectStatus.PLANNED);
        project1.setLeader(leader);
        projectRepository.save(project1);

        Project project2 = new Project();
        project2.setName("Project 2");
        project2.setDescription("Second test project");
        project2.setDueDate(LocalDateTime.now().plusDays(15));
        project2.setStatus(ProjectStatus.PLANNED);
        project2.setLeader(leader);
        projectRepository.save(project2);

        Task task = new Task();
        task.setTitle("Test Task2");
        task.setProject(project1);
        task.setDueDate(LocalDateTime.now().plusDays(7));
        taskRepository.save(task);

        Task task2 = new Task();
        task2.setTitle("Test Task2");
        task2.setProject(project2);
        task2.setDueDate(LocalDateTime.now().plusDays(7));
        taskRepository.save(task2);

        anotherUser.getTasks().add(task);
        anotherUser.getTasks().add(task2);
        appUserRepository.save(anotherUser);

        api.perform(get("/appUsers/{userId}/projects", anotherUser.getId())
                        .param("page", "0")
                        .param("size", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.size()").value(2))
                .andExpect(jsonPath("$.content[0].name").value("Project 1"))
                .andExpect(jsonPath("$.content[1].name").value("Project 2"));
    }
    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void testFindProjectsByAppUserIdInTasksWithNoProjects() throws Exception {
        AppUser userWithNoProjects = new AppUser();
        userWithNoProjects.setUsername("userWithNoProjects");
        userWithNoProjects.setEmail("userwithnoprojects@example.com");
        appUserRepository.save(userWithNoProjects);

        api.perform(get("/appUsers/{userId}/projects", userWithNoProjects.getId())
                        .param("page", "0")
                        .param("size", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.size()").value(0));
    }

    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void testFindAppUserProjects() throws Exception {
        api.perform(get("/appUsers/{userId}/my-projects", appUser.getId())
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.size()").value(1));
    }
}

