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
import upce.backend.dto.attendance.AttendanceRequest;
import upce.backend.entity.*;
import upce.backend.repository.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AttendanceControllerTest {

    @Autowired
    private MockMvc api;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    private ObjectMapper objectMapper;
    private Attendance attendance;
    private Task task;
    private Project project;
    private AppUser appUser;

    @Autowired
    private RoleRepository roleRepository;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        Role role = new Role();
        role.setName("EMPLOYEE");
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
        task.setProject(project);
        taskRepository.save(task);

        attendance = new Attendance();
        attendance.setStartTime(LocalDateTime.now());
        attendance.setEndTime(LocalDateTime.now().plusHours(1));
        attendance.setTask(task);
        attendance.setUser(appUser);
        attendanceRepository.save(attendance);
    }

    @AfterEach
    void tearDown() {
        attendanceRepository.deleteAll();
        appUserRepository.deleteAll();
        roleRepository.deleteAll();
        projectRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testFindAllAttendances() throws Exception {
        api.perform(get("/attendances")
                        .param("page", String.valueOf(0))
                        .param("size", String.valueOf(2))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void testCreateAttendance() throws Exception {
        attendanceRepository.deleteAll();
        LocalDateTime startTime = LocalDateTime.of(2024, 10, 30, 0, 30);
        LocalDateTime endTime = LocalDateTime.of(2025, 10, 30, 0, 30);

        AttendanceRequest attendanceRequest = AttendanceRequest.builder()
                .taskId(task.getId())
                .appUserId(appUser.getId())
                .startTime(startTime)
                .endTime(endTime)
                .build();

        String requestBody = objectMapper.writeValueAsString(attendanceRequest);

        api.perform(post("/attendances")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());


        Attendance savedAttendance = attendanceRepository.findAll().getFirst();


        assertNotNull(savedAttendance);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        String expectedStartTimeStr = startTime.format(formatter);
        String actualStartTimeStr = savedAttendance.getStartTime().format(formatter);
        String expectedEndTimeStr = endTime.format(formatter);
        String actualEndTimeStr = savedAttendance.getEndTime().format(formatter);


        assertEquals(expectedStartTimeStr, actualStartTimeStr);
        assertEquals(expectedEndTimeStr, actualEndTimeStr);
    }

    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void testUpdateAttendance() throws Exception {

        LocalDateTime updatedStartTime = LocalDateTime.of(2024, 10, 31, 0, 30);
        LocalDateTime updatedEndTime = LocalDateTime.of(2025, 10, 30, 0, 30);

        AttendanceRequest attendanceRequest = AttendanceRequest.builder()
                .taskId(task.getId())
                .appUserId(appUser.getId())
                .startTime(updatedStartTime)
                .endTime(updatedEndTime)
                .build();

        String updateRequestBody = objectMapper.writeValueAsString(attendanceRequest);
        api.perform(put("/attendances/{id}", attendance.getId())
                        .content(updateRequestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Attendance updatedAttendance = attendanceRepository.findById(attendance.getId()).orElse(null);
        assertNotNull(updatedAttendance);

        String expectedStartTimeStr = updatedStartTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        String actualStartTimeStr = updatedAttendance.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        String expectedEndTimeStr = updatedEndTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        String actualEndTimeStr = updatedAttendance.getEndTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        assertEquals(expectedStartTimeStr, actualStartTimeStr);
        assertEquals(expectedEndTimeStr, actualEndTimeStr);
    }

    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void testDeleteAttendance() throws Exception {
        api.perform(delete("/attendances/{id}", attendance.getId()))
                .andExpect(status().isNoContent());

        Attendance deletedAttendance = attendanceRepository.findById(attendance.getId()).orElse(null);
        assertNull(deletedAttendance);
    }
    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void testFindAttendancesByTaskId() throws Exception {
        Task otherTask = new Task();
        otherTask.setTitle("Other Task");
        otherTask.setProject(project);
        taskRepository.save(otherTask);

        Attendance attendanceForOtherTask = new Attendance();
        attendanceForOtherTask.setStartTime(LocalDateTime.now().plusHours(4));
        attendanceForOtherTask.setEndTime(LocalDateTime.now().plusHours(5));
        attendanceForOtherTask.setTask(otherTask);
        attendanceForOtherTask.setUser(appUser);
        attendanceRepository.save(attendanceForOtherTask);

        Attendance anotherAttendance = new Attendance();
        anotherAttendance.setStartTime(LocalDateTime.now().plusHours(2));
        anotherAttendance.setEndTime(LocalDateTime.now().plusHours(3));
        anotherAttendance.setTask(task);
        anotherAttendance.setUser(appUser);
        attendanceRepository.save(anotherAttendance);

        api.perform(get("/attendances/tasks/{taskId}", otherTask.getId())
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.size()").value(1))
                .andExpect(jsonPath("$.content[0].taskId").value(otherTask.getId()));
    }
}
