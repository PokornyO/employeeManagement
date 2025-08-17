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
import upce.backend.dto.comment.CommentRequest;
import upce.backend.entity.*;
import upce.backend.enums.TaskDifficulty;
import upce.backend.enums.TaskStatus;
import upce.backend.repository.*;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CommentControllerTest {

    @Autowired
    private MockMvc api;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private ObjectMapper objectMapper;
    private AppUser appUser;
    private Task task;
    private Comment comment;
    private Project project;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        Role role = new Role();
        role.setName("ROLE_EMPLOYEE");
        Role roleLeader = new Role();
        role.setName("ROLE_LEADER");
        roleRepository.save(role);
        roleRepository.save(roleLeader);

        AppUser leader = new AppUser();;
        leader.setUsername("leader");
        leader.setRole(roleLeader);
        leader.setEmail("testuser@example.com");

        appUserRepository.save(leader);

        project = new Project();
        project.setName("Test Project");
        project.setLeader(leader);
        projectRepository.save(project);

        appUser = new AppUser();
        appUser.setUsername("testUser");
        appUser.setEmail("testuser@example.com");
        appUser.setRole(role);
        appUser.getAppuserProjects().add(project);
        appUserRepository.save(appUser);

        task = new Task();
        task.setTitle("Test Task");
        task.setDifficulty(TaskDifficulty.EASY);
        task.setStatus(TaskStatus.TODO);
        task.setDueDate(LocalDateTime.now().plusDays(5));
        task.setProject(project);
        task.getAppUsers().add(appUser);
        taskRepository.save(task);

        comment = new Comment();
        comment.setText("Initial comment");
        comment.setCreatedDate(LocalDateTime.now());
        comment.setTask(task);
        comment.setUser(appUser);
        commentRepository.save(comment);
    }

    @AfterEach
    void tearDown() {
        commentRepository.deleteAll();
        appUserRepository.deleteAll();
        projectRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllComments() throws Exception {
        api.perform(get("/comments")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.size()").value(1))
                .andExpect(jsonPath("$.content[0].text").value("Initial comment"));
    }

    @Test
    @WithMockUser(roles = "USER", username = "testUser")
    void testGetCommentById() throws Exception {
        api.perform(get("/comments/{id}", comment.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.text").value("Initial comment"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetCommentsByTaskId() throws Exception {
        api.perform(get("/tasks/{taskId}/comments", task.getId())
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.size()").value(1))
                .andExpect(jsonPath("$.content[0].text").value("Initial comment"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetCommentsByUserId() throws Exception {
        api.perform(get("/appUsers/{userId}/comments", appUser.getId())
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.size()").value(1))
                .andExpect(jsonPath("$.content[0].text").value("Initial comment"));
    }

    @Test
    @WithMockUser(roles = "USER", username = "testUser")
    void testCreateComment() throws Exception {
        CommentRequest commentRequest = CommentRequest.builder()
                .text("New comment")
                .taskId(task.getId())
                .userId(appUser.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(commentRequest);

        api.perform(post("/comments")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.text").value("New comment"));

        assertEquals(2, commentRepository.count());
    }

    @Test
    @WithMockUser(roles = "USER", username = "testUser")
    void testUpdateComment() throws Exception {
        CommentRequest updatedRequest = CommentRequest.builder()
                .text("Updated comment")
                .taskId(task.getId())
                .userId(appUser.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(updatedRequest);

        api.perform(put("/comments/{id}", comment.getId())
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.text").value("Updated comment"));

        Comment updatedComment = commentRepository.findById(comment.getId()).orElse(null);
        assertNotNull(updatedComment);
        assertEquals("Updated comment", updatedComment.getText());
    }

    @Test
    @WithMockUser(roles = "USER", username = "testUser")
    void testDeleteComment() throws Exception {
        api.perform(delete("/comments/{id}", comment.getId()))
                .andExpect(status().isNoContent());

        assertFalse(commentRepository.existsById(comment.getId()));
    }

    @Test
    @WithMockUser(roles = "USER", username = "testUser")
    void testUpdateNonExistentComment() throws Exception {
        Long nonExistentId = 999L;

        CommentRequest updatedRequest = CommentRequest.builder()
                .text("Non-existent comment")
                .taskId(task.getId())
                .userId(appUser.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(updatedRequest);

        api.perform(put("/comments/{id}", nonExistentId)
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "USER", username = "unauthorizedUser")
    void testUnauthorizedUserCannotCommentOnTask() throws Exception {
        AppUser unauthorizedUser = new AppUser();
        unauthorizedUser.setUsername("unauthorizedUser");
        unauthorizedUser.setEmail("unauthorized@example.com");
        appUserRepository.save(unauthorizedUser);

        CommentRequest commentRequest = CommentRequest.builder()
                .text("Unauthorized comment")
                .taskId(task.getId())
                .userId(unauthorizedUser.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(commentRequest);

        api.perform(post("/comments")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
