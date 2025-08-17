package upce.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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
import upce.backend.dto.performanceReport.PerformanceReportRequest;
import upce.backend.entity.*;
import upce.backend.enums.TaskStatus;
import upce.backend.repository.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PerformanceReportControllerTest {

    @Autowired
    private MockMvc api;

    @Autowired
    private PerformanceReportRepository performanceReportRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private RoleRepository roleRepository;

    private ObjectMapper objectMapper;
    private PerformanceReport performanceReport;
    private AppUser appUser;
    private Task task;

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

        Project project = new Project();
        project.setName("Test Project");
        project.setLeader(leader);
        projectRepository.save(project);

        appUser = new AppUser();
        appUser.setUsername("testUser");
        appUser.setEmail("testuser@example.com");
        appUser.getAppuserProjects().add(project);
        appUser.setRole(role);
        appUserRepository.save(appUser);

        task = new Task();
        task.setTitle("Test Task");
        task.setStatus(TaskStatus.COMPLETED);
        task.setDueDate(LocalDateTime.now().plusDays(5));
        task.setProject(project);
        taskRepository.save(task);

        performanceReport = new PerformanceReport();
        performanceReport.setReviewDate(LocalDateTime.now());
        performanceReport.setOverallRating(4.5);
        performanceReport.setFeedback("Great work!");
        performanceReport.setAppUser(appUser);
        performanceReport.setTask(task);
        performanceReportRepository.save(performanceReport);
    }

    @AfterEach
    void tearDown() {
        performanceReportRepository.deleteAll();
        appUserRepository.deleteAll();
        roleRepository.deleteAll();
        projectRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllPerformanceReports() throws Exception {
        api.perform(get("/performance-reports")
                        .param("page", "0")
                        .param("size", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetPerformanceReportsByTaskId() throws Exception {
        api.perform(get("/tasks/{taskId}/performance-reports", task.getId())
                        .param("page", "0")
                        .param("size", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.size()").value(1))
                .andExpect(jsonPath("$.content[0].feedback").value("Great work!"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetPerformanceReportsByUserId() throws Exception {
        api.perform(get("/appUsers/{userId}/performance-reports", appUser.getId())
                        .param("page", "0")
                        .param("size", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.size()").value(1))
                .andExpect(jsonPath("$.content[0].feedback").value("Great work!"));
    }

    @Test
    @WithMockUser(roles = "LEADER", username = "leader")
    void testCreatePerformanceReport() throws Exception {
        PerformanceReportRequest reportRequest = PerformanceReportRequest.builder()
                .overallRating(5.0)
                .feedback("Excellent performance")
                .userId(appUser.getId())
                .taskId(task.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(reportRequest);

        api.perform(post("/performance-reports")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());

        PerformanceReport savedReport = performanceReportRepository.findAll().get(1);
        assertNotNull(savedReport);
        assertEquals("Excellent performance", savedReport.getFeedback());
    }

    @Test
    @WithMockUser(roles = "LEADER", username = "leader")
    void testUpdatePerformanceReport() throws Exception {
        PerformanceReportRequest reportRequest = PerformanceReportRequest.builder()
                .overallRating(4.0)
                .feedback("Updated feedback")
                .userId(appUser.getId())
                .taskId(task.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(reportRequest);

        api.perform(put("/performance-reports/{id}", performanceReport.getId())
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        PerformanceReport updatedReport = performanceReportRepository.findById(performanceReport.getId()).orElse(null);
        assertNotNull(updatedReport);
        assertEquals("Updated feedback", updatedReport.getFeedback());
    }

    @Test
    @WithMockUser(roles = "LEADER", username = "leader")
    void testUpdateNonExistentPerformanceReport() throws Exception {
        Long nonExistentId = 999L;

        PerformanceReportRequest reportRequest = PerformanceReportRequest.builder()
                .overallRating(4.0)
                .feedback("Feedback for non-existent report")
                .userId(appUser.getId())
                .taskId(task.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(reportRequest);
        api.perform(put("/performance-reports/{id}", nonExistentId)
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
