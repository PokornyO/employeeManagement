package upce.backend.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import upce.backend.dto.statistics.*;
import upce.backend.entity.AppUser;
import upce.backend.entity.Attendance;
import upce.backend.entity.Project;
import upce.backend.entity.Task;
import upce.backend.enums.ProjectStatus;
import upce.backend.enums.TaskStatus;
import upce.backend.exception.ResourceNotFoundException;
import upce.backend.mapper.AppUserMapper;
import upce.backend.mapper.ProjectMapper;
import upce.backend.repository.AppUserRepository;
import upce.backend.repository.AttendanceRepository;
import upce.backend.repository.ProjectRepository;
import upce.backend.repository.TaskRepository;

import java.time.Duration;
import java.time.LocalDate;
import java.util.*;

@Service
@AllArgsConstructor
public class StatisticsService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final AppUserRepository appUserRepository;
    private final AttendanceRepository attendanceRepository;

    private final ProjectMapper projectMapper;
    private AppUserMapper appUserMapper;

    public GlobalProjectStatisticsResponse getGlobalProjectStatistics() {
        return GlobalProjectStatisticsResponse.builder()
                .totalProjects(projectRepository.count())
                .plannedProjects(projectRepository.countByStatus(ProjectStatus.PLANNED))
                .inProgressProjects(projectRepository.countByStatus(ProjectStatus.IN_PROGRESS))
                .completedProjects(projectRepository.countByStatus(ProjectStatus.COMPLETED))
                .completedProjectsOnTime(projectRepository.countByStatusAndCompletedOnTime())
                .completedProjectsLate(projectRepository.countByStatusAndCompletedLate())
                .cancelledProjects(projectRepository.countByStatus(ProjectStatus.CANCELLED))
                .build();
    }

    public SingleProjectStatisticsResponse getSpecificProjectStatistics(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        return SingleProjectStatisticsResponse.builder()
                .totalTasks(taskRepository.countByProjectId(projectId))
                .todoTasks(taskRepository.countByProjectIdAndStatus(projectId, TaskStatus.TODO))
                .inProgressTasks(taskRepository.countByProjectIdAndStatus(projectId, TaskStatus.IN_PROGRESS))
                .toBeReviewedTasks(taskRepository.countByProjectIdAndStatus(projectId, TaskStatus.REVIEW))
                .completedTasks(taskRepository.countByProjectIdAndStatus(projectId, TaskStatus.COMPLETED))
                .completedTasksOnTime(taskRepository.countByProjectIdAndCompletedOnTime(projectId))
                .completedTasksLate(taskRepository.countByProjectIdAndCompletedLate(projectId))
                .project(projectMapper.toDto(project))
                .build();
    }

    public GlobalAppUserStatisticsResponse getProjectGlobalAppUserStatistics(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }

        long totalUsers = appUserRepository.countByProjectId(projectId);
        int totalTasks = taskRepository.countByProjectId(projectId);

        List<Attendance> attendanceList = attendanceRepository.findByProjectId(projectId);

        double totalHoursWorked = 0;

        for (Attendance attendance : attendanceList) {
            totalHoursWorked += Duration.between(attendance.getStartTime(), attendance.getEndTime()).toHours();
        }

        double averageHoursPerTask = totalTasks > 0 ? totalHoursWorked / totalTasks : 0;

        return GlobalAppUserStatisticsResponse.builder()
                .totalUsers(totalUsers)
                .totalHoursWorked(totalHoursWorked)
                .averageHoursPerTask(averageHoursPerTask)
                .build();
    }

    public SingleAppUserStatisticsResponse getProjectSpecificUserStatistics(Long projectId, Long userId) {
        AppUser appUser = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("App user not found with id: " + userId));

        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }

        int totalTasks = taskRepository.countByProjectIdAndAppUserId(projectId, appUser);
        int completedTasks = taskRepository.countByProjectIdAndAppUserIdAndStatus(projectId, appUser, TaskStatus.COMPLETED);
        int completedTasksOnTime = taskRepository.countByProjectIdAndAppUserIdAndCompletedOnTime(projectId, appUser);
        int completedTasksLate = completedTasks - completedTasksOnTime;

        List<Attendance> attendanceList = attendanceRepository.findByProjectIdAndUserId(projectId, userId);

        double totalHoursWorked = 0;

        for (Attendance attendance : attendanceList) {
            totalHoursWorked += Duration.between(attendance.getStartTime(), attendance.getEndTime()).toHours();
        }

        double averageHoursPerTask = totalTasks > 0 ? totalHoursWorked / totalTasks : 0;

        return SingleAppUserStatisticsResponse.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .completedTasksOnTime(completedTasksOnTime)
                .completedTasksLate(completedTasksLate)
                .totalHoursWorked(totalHoursWorked)
                .averageHoursPerTask(averageHoursPerTask)
                .appUser(appUserMapper.toDto(appUser))
                .build();
    }

    public List<DailyUserStatisticsResponse> getProjectGlobalDailyUserStatistics(Long projectId, LocalDate startDate, LocalDate endDate) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }

        List<Task> tasks = taskRepository.findByProjectIdAndCompletionDateBetween(projectId, startDate.atStartOfDay(), endDate.atTime(23, 59));
        List<Attendance> attendances = attendanceRepository.findByProjectIdAndStartTimeBetween(projectId, startDate.atStartOfDay(), endDate.atTime(23, 59));

        return getDailyUserStatisticsResponses(startDate, endDate, tasks, attendances);
    }

    public List<DailyUserStatisticsResponse> getProjectSpecificDailyUserStatistics(Long projectId, Long userId, LocalDate startDate, LocalDate endDate) {
        List<Task> tasks = taskRepository.findByProjectIdAndUserIdAndCompletionDateBetween(
                projectId, userId, startDate.atStartOfDay(), endDate.atTime(23, 59));
        List<Attendance> attendances = attendanceRepository.findByProjectIdAndUserIdAndStartTimeBetween(
                projectId, userId, startDate.atStartOfDay(), endDate.atTime(23, 59));

        return getDailyUserStatisticsResponses(startDate, endDate, tasks, attendances);
    }

    private List<DailyUserStatisticsResponse> getDailyUserStatisticsResponses(LocalDate startDate, LocalDate endDate, List<Task> tasks, List<Attendance> attendances) {
        Map<LocalDate, Integer> taskStats = new HashMap<>();
        for (Task task : tasks) {
            LocalDate date = task.getFinishDate().toLocalDate();
            taskStats.put(date, taskStats.getOrDefault(date, 0) + 1); // 0 or increments value if more tasks finished that day
        }
        Map<LocalDate, Double> hoursStats = new HashMap<>();
        for (Attendance attendance : attendances) {
            LocalDate date = attendance.getStartTime().toLocalDate();
            double hours = Duration.between(attendance.getStartTime(), attendance.getEndTime()).toHours();
            hoursStats.put(date, hoursStats.getOrDefault(date, 0.0) + hours);
        }

        List<LocalDate> allDates = new ArrayList<>();
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            allDates.add(currentDate);
            currentDate = currentDate.plusDays(1);
        }

        List<DailyUserStatisticsResponse> result = new ArrayList<>();
        for (LocalDate date : allDates) {
            result.add(DailyUserStatisticsResponse.builder()
                    .date(date)
                    .totalCompletedTasks(taskStats.getOrDefault(date, 0))
                    .totalWorkedHours(hoursStats.getOrDefault(date, 0.0))
                    .build());
        }
        return result;
    }

    public List<ProjectUserStatisticsSummary> getProjectUsersSummaryResponses(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }

        List<AppUser> projectUsers = appUserRepository.findAllUsersByProjectId(projectId);
        List<ProjectUserStatisticsSummary> userStatisticsList = new ArrayList<>();

        for (AppUser appUser : projectUsers) {
            int completedTasks = taskRepository.countByProjectIdAndAppUserIdAndStatus(projectId, appUser, TaskStatus.COMPLETED);

            List<Attendance> attendances = attendanceRepository.findByProjectIdAndUserId(projectId, appUser.getId());
            double totalWorkedHours = 0;
            for (Attendance attendance : attendances) {
                totalWorkedHours += Duration.between(attendance.getStartTime(), attendance.getEndTime()).toHours();
            }

            ProjectUserStatisticsSummary response = ProjectUserStatisticsSummary.builder()
                    .completedTasks(completedTasks)
                    .workedHours(totalWorkedHours)
                    .appuser(appUserMapper.toDto(appUser))
                    .build();

            userStatisticsList.add(response);
        }
        userStatisticsList.sort((Comparator.comparingDouble(ProjectUserStatisticsSummary::getWorkedHours)).reversed());

        return userStatisticsList;
    }
}
