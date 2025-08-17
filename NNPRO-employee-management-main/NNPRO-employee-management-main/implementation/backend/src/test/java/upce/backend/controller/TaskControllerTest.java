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
import upce.backend.dto.task.TaskRequest;
import upce.backend.entity.AppUser;
import upce.backend.entity.Project;
import upce.backend.entity.Role;
import upce.backend.entity.Task;
import upce.backend.enums.TaskDifficulty;
import upce.backend.enums.TaskStatus;
import upce.backend.repository.AppUserRepository;
import upce.backend.repository.ProjectRepository;
import upce.backend.repository.RoleRepository;
import upce.backend.repository.TaskRepository;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskControllerTest {

    @Autowired
    private MockMvc api;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private RoleRepository roleRepository;

    private ObjectMapper objectMapper;

    private Task task;
    private Task task2;
    private Project project;
    private AppUser appUser;


    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        Role role = new Role();
        role.setName("ROLE_EMPLOYEE");
        roleRepository.save(role);

        appUser = new AppUser();
        appUser.setUsername("testUser");
        appUser.setEmail("testuser@example.com");
        appUser.setRole(role);
        appUserRepository.save(appUser);

        project = new Project();
        project.setName("Test Project");
        project.setLeader(appUser);
        projectRepository.save(project);

        task = new Task();
        task.setTitle("Test Task");
        task.setStatus(TaskStatus.TODO);
        task.setDifficulty(TaskDifficulty.EASY);
        task.setProject(project);
        task.setDueDate(LocalDateTime.now().plusDays(7));
        taskRepository.save(task);

        task2 = new Task();
        task2.setTitle("Test Task2");
        task2.setStatus(TaskStatus.TODO);
        task2.setDifficulty(TaskDifficulty.EASY);
        task2.setProject(project);
        task2.setDueDate(LocalDateTime.now().plusDays(8));
        taskRepository.save(task2);

        appUser.getTasks().add(task);
        appUser.getTasks().add(task2);
        appUserRepository.save(appUser);
    }

    @AfterEach
    void tearDown() {
        appUserRepository.deleteAll();
        roleRepository.deleteAll();
        projectRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testFindAllTasks() throws Exception {
        api.perform(get("/tasks")
                        .param("page", String.valueOf(0))
                        .param("size", String.valueOf(2))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void testFindTasksByUserId() throws Exception {
        api.perform(get("/appusers/{userId}/tasks", appUser.getId())
                        .param("page", String.valueOf(0))
                        .param("size", String.valueOf(5))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content.size()").value(2))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateTask() throws Exception {
        TaskRequest taskRequest = TaskRequest.builder()
                .title("New Task")
                .description("Description of new task")
                .dueDate(LocalDateTime.now().plusDays(3))
                .status("TODO")
                .difficulty("EASY")
                .projectId(project.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(taskRequest);

        api.perform(post("/tasks")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());

        Task savedTask = taskRepository.findAll().stream().filter(task1 -> task1.getTitle().equals(taskRequest.getTitle())).findFirst().get();
        assertNotNull(savedTask);
        assertEquals("New Task", savedTask.getTitle());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testUpdateTask() throws Exception {
        LocalDateTime updatedDueDate = LocalDateTime.now().plusDays(5);

        TaskRequest taskRequest = TaskRequest.builder()
                .title("Updated Task")
                .description("Updated description")
                .dueDate(updatedDueDate)
                .status("IN_PROGRESS")
                .difficulty("EASY")
                .projectId(project.getId())
                .build();

        String updateRequestBody = objectMapper.writeValueAsString(taskRequest);

        api.perform(put("/tasks/{id}", task.getId())
                        .content(updateRequestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Task updatedTask = taskRepository.findById(task.getId()).orElse(null);
        assertNotNull(updatedTask);
        assertEquals("Updated Task", updatedTask.getTitle());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteTask() throws Exception {

        api.perform(delete("/tasks/{id}", task.getId()))
                .andExpect(status().isNoContent());

        Task deletedTask = taskRepository.findById(task.getId()).orElse(null);
        assertNull(deletedTask);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testFindByProjectId() throws Exception {
        api.perform(get("/projects/{projectId}/tasks", project.getId())
                        .param("page", String.valueOf(0))
                        .param("size", String.valueOf(2))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testFindByProjectIdWithMinDueDateFilter() throws Exception {
        LocalDateTime minDueDate = LocalDateTime.now().plusDays(5);

        api.perform(get("/projects/{projectId}/tasks", project.getId())
                        .param("page", "0")
                        .param("size", "10")
                        .param("minDueDate", minDueDate.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testFindByProjectIdWithMaxDueDateFilter() throws Exception {
        LocalDateTime maxDueDate = LocalDateTime.now().plusDays(10);

        api.perform(get("/projects/{projectId}/tasks", project.getId())
                        .param("page", "0")
                        .param("size", "10")
                        .param("maxDueDate", maxDueDate.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content",hasSize(2)));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testFindByProjectIdWithMinAndMaxDueDateFilter() throws Exception {
        LocalDateTime minDueDate = LocalDateTime.now().plusDays(5);
        LocalDateTime maxDueDate = LocalDateTime.now().plusDays(10);

        api.perform(get("/projects/{projectId}/tasks", project.getId())
                        .param("page", "0")
                        .param("size", "2")
                        .param("minDueDate", minDueDate.toString())
                        .param("maxDueDate", maxDueDate.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testFindByProjectIdWithNoResultsForDueDateFilter() throws Exception {
        LocalDateTime minDueDate = LocalDateTime.now().plusDays(30);

        api.perform(get("/projects/{projectId}/tasks", project.getId())
                        .param("page", "0")
                        .param("size", "2")
                        .param("minDueDate", minDueDate.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateTaskWithInvalidProject() throws Exception {
        TaskRequest taskRequest = TaskRequest.builder()
                .title("Task with invalid project")
                .description("This task should fail")
                .dueDate(LocalDateTime.now().plusDays(3))
                .difficulty("EASY")
                .status("IN_PROGRESS")
                .projectId(9999L)
                .build();

        String requestBody = objectMapper.writeValueAsString(taskRequest);

        api.perform(post("/tasks")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void testUpdateNonExistentTask() throws Exception {
        TaskRequest taskRequest = TaskRequest.builder()
                .title("Updated Task")
                .description("This task does not exist")
                .dueDate(LocalDateTime.now().plusDays(5))
                .difficulty("EASY")
                .status("IN_PROGRESS")
                .projectId(project.getId())
                .build();

        String updateRequestBody = objectMapper.writeValueAsString(taskRequest);

        api.perform(put("/tasks/{id}", 9999L)
                        .content(updateRequestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }


}
