package upce.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import upce.backend.dto.statistics.GlobalAppUserStatisticsResponse;
import upce.backend.dto.statistics.GlobalProjectStatisticsResponse;
import upce.backend.dto.statistics.SingleAppUserStatisticsResponse;
import upce.backend.dto.statistics.SingleProjectStatisticsResponse;
import upce.backend.entity.AppUser;
import upce.backend.entity.Attendance;
import upce.backend.entity.Project;
import upce.backend.enums.ProjectStatus;
import upce.backend.enums.TaskStatus;
import upce.backend.exception.ResourceNotFoundException;
import upce.backend.mapper.AppUserMapper;
import upce.backend.mapper.ProjectMapper;
import upce.backend.repository.AppUserRepository;
import upce.backend.repository.AttendanceRepository;
import upce.backend.repository.ProjectRepository;
import upce.backend.repository.TaskRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatisticsServiceTest {

    @InjectMocks
    private StatisticsService statisticsService;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private ProjectMapper projectMapper;

    @Mock
    private AppUserMapper appUserMapper;

    @Test
    void testGetGlobalProjectStatistics() {
        when(projectRepository.count()).thenReturn(10L);
        when(projectRepository.countByStatus(ProjectStatus.PLANNED)).thenReturn(2);
        when(projectRepository.countByStatus(ProjectStatus.IN_PROGRESS)).thenReturn(3);
        when(projectRepository.countByStatus(ProjectStatus.COMPLETED)).thenReturn(4);
        when(projectRepository.countByStatusAndCompletedOnTime()).thenReturn(3);
        when(projectRepository.countByStatusAndCompletedLate()).thenReturn(1);
        when(projectRepository.countByStatus(ProjectStatus.CANCELLED)).thenReturn(1);

        GlobalProjectStatisticsResponse response = statisticsService.getGlobalProjectStatistics();

        assertEquals(10, response.getTotalProjects());
        assertEquals(2, response.getPlannedProjects());
        assertEquals(3, response.getInProgressProjects());
        assertEquals(4, response.getCompletedProjects());
        assertEquals(3, response.getCompletedProjectsOnTime());
        assertEquals(1, response.getCompletedProjectsLate());
        assertEquals(1, response.getCancelledProjects());
    }

    @Test
    void testGetSpecificProjectStatistics_ProjectNotFound() {
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> statisticsService.getSpecificProjectStatistics(1L));

        assertEquals("Project not found with id: 1", exception.getMessage());
    }

    @Test
    void testGetSpecificProjectStatistics() {
        Project project = new Project();
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(taskRepository.countByProjectId(1L)).thenReturn(10);
        when(taskRepository.countByProjectIdAndStatus(1L, TaskStatus.TODO)).thenReturn(3);
        when(taskRepository.countByProjectIdAndStatus(1L, TaskStatus.IN_PROGRESS)).thenReturn(2);
        when(taskRepository.countByProjectIdAndStatus(1L, TaskStatus.REVIEW)).thenReturn(1);
        when(taskRepository.countByProjectIdAndStatus(1L, TaskStatus.COMPLETED)).thenReturn(4);
        when(taskRepository.countByProjectIdAndCompletedOnTime(1L)).thenReturn(3);
        when(taskRepository.countByProjectIdAndCompletedLate(1L)).thenReturn(1);


        SingleProjectStatisticsResponse response = statisticsService.getSpecificProjectStatistics(1L);

        assertEquals(10, response.getTotalTasks());
        assertEquals(3, response.getTodoTasks());
        assertEquals(2, response.getInProgressTasks());
        assertEquals(1, response.getToBeReviewedTasks());
        assertEquals(4, response.getCompletedTasks());
        assertEquals(3, response.getCompletedTasksOnTime());
        assertEquals(1, response.getCompletedTasksLate());
    }

    @Test
    void testGetProjectGlobalAppUserStatistics_ProjectNotFound() {
        when(projectRepository.existsById(1L)).thenReturn(false);

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> statisticsService.getProjectGlobalAppUserStatistics(1L));

        assertEquals("Project not found with id: 1", exception.getMessage());
    }

    @Test
    void testGetProjectGlobalAppUserStatistics() {
        when(projectRepository.existsById(1L)).thenReturn(true);
        when(appUserRepository.countByProjectId(1L)).thenReturn(5);
        when(taskRepository.countByProjectId(1L)).thenReturn(10);

        List<Attendance> attendances = new ArrayList<>();
        Attendance attendance = new Attendance();
        attendance.setStartTime(LocalDateTime.of(2024, 12, 1, 8, 0));
        attendance.setEndTime(LocalDateTime.of(2024, 12, 1, 10, 0));
        attendances.add(attendance);
        when(attendanceRepository.findByProjectId(1L)).thenReturn(attendances);

        GlobalAppUserStatisticsResponse response = statisticsService.getProjectGlobalAppUserStatistics(1L);

        assertEquals(5, response.getTotalUsers());
        assertEquals(2.0, response.getTotalHoursWorked());
        assertEquals(0.2, response.getAverageHoursPerTask());
    }

    @Test
    void testGetProjectSpecificUserStatistics_UserNotFound() {
        when(appUserRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> statisticsService.getProjectSpecificUserStatistics(1L, 1L));

        assertEquals("App user not found with id: 1", exception.getMessage());
    }

    @Test
    void testGetProjectSpecificUserStatistics_ProjectNotFound() {
        when(appUserRepository.findById(1L)).thenReturn(Optional.of(new AppUser()));
        when(projectRepository.existsById(1L)).thenReturn(false);

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> statisticsService.getProjectSpecificUserStatistics(1L, 1L));

        assertEquals("Project not found with id: 1", exception.getMessage());
    }

    @Test
    void testGetProjectSpecificUserStatistics_Success() {
        AppUser user = new AppUser();
        user.setId(1L);
        when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));
        when(projectRepository.existsById(1L)).thenReturn(true);

        when(taskRepository.countByProjectIdAndAppUserId(1L, user)).thenReturn(10);
        when(taskRepository.countByProjectIdAndAppUserIdAndStatus(1L, user, TaskStatus.COMPLETED)).thenReturn(8);
        when(taskRepository.countByProjectIdAndAppUserIdAndCompletedOnTime(1L, user)).thenReturn(6);

        List<Attendance> attendances = new ArrayList<>();
        Attendance attendance1 = new Attendance();
        attendance1.setStartTime(LocalDateTime.of(2024, 12, 1, 8, 0));
        attendance1.setEndTime(LocalDateTime.of(2024, 12, 1, 12, 0));
        attendances.add(attendance1);

        Attendance attendance2 = new Attendance();
        attendance2.setStartTime(LocalDateTime.of(2024, 12, 2, 9, 0));
        attendance2.setEndTime(LocalDateTime.of(2024, 12, 2, 11, 0));
        attendances.add(attendance2);

        when(attendanceRepository.findByProjectIdAndUserId(1L, 1L)).thenReturn(attendances);


        SingleAppUserStatisticsResponse response = statisticsService.getProjectSpecificUserStatistics(1L, 1L);

        assertEquals(10, response.getTotalTasks());
        assertEquals(8, response.getCompletedTasks());
        assertEquals(6, response.getCompletedTasksOnTime());
        assertEquals(6.0, response.getTotalHoursWorked());
        assertEquals(0.6, response.getAverageHoursPerTask());
    }
}