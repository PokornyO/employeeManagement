package upce.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import upce.backend.dto.statistics.*;
import upce.backend.service.StatisticsService;

import java.time.LocalDate;
import java.util.List;

@RestController
@AllArgsConstructor
@Tag(name = "Statistics", description = "Project and appusers statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @Operation(summary = "Get global project statistics", description = "Retrieves a global statistics of all projects in application")
    @GetMapping("/projects/statistics")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<GlobalProjectStatisticsResponse> getGlobalProjectStatistics() {
        return ResponseEntity.ok(statisticsService.getGlobalProjectStatistics());
    }

    @Operation(summary = "Get specific project statistics", description = "Retrieves statistics of a specific project by its ID")
    @GetMapping("/projects/{projectId}/statistics")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<SingleProjectStatisticsResponse> getSpecificProjectStatistics(@PathVariable Long projectId) {
        return ResponseEntity.ok(statisticsService.getSpecificProjectStatistics(projectId));
    }

    @Operation(summary = "Get global statistics for app users in a project",
            description = "Retrieves global statistics for app users in the specified project")
    @GetMapping("/appusers/projects/{projectId}/statistics")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<GlobalAppUserStatisticsResponse> getProjectGlobalAppUserStatistics(@PathVariable Long projectId) {
        return ResponseEntity.ok(statisticsService.getProjectGlobalAppUserStatistics(projectId));
    }

    @Operation(summary = "Get specific statistics for a user in a project", description = "Retrieves statistics for a specific user in a project")
    @GetMapping("/appusers/{userId}/projects/{projectId}/statistics")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<SingleAppUserStatisticsResponse> getProjectSpecificUserStatistics(@PathVariable Long projectId, @PathVariable Long userId) {
        return ResponseEntity.ok(statisticsService.getProjectSpecificUserStatistics(projectId, userId));
    }

    @Operation(summary = "Get global daily statistics for users in a project",
            description = "Retrieves global daily statistics for app users in a specific project within a given date range")
    @GetMapping("/appusers/projects/{projectId}/statistics-daily")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<List<DailyUserStatisticsResponse>> getGlobalDailyUserStatistics(
            @PathVariable Long projectId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(statisticsService.getProjectGlobalDailyUserStatistics(projectId,startDate, endDate));
    }

    @Operation(summary = "Get specific daily statistics for a user in a project",
            description = "Retrieves daily statistics for a specific user in a project within a given date range")
    @GetMapping("/appusers/{userId}/projects/{projectId}/statistics-daily")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<List<DailyUserStatisticsResponse>> getSpecificDailyUserStatistics(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(statisticsService.getProjectSpecificDailyUserStatistics(projectId, userId, startDate, endDate));
    }

    @Operation(summary = "Get leaderboard of users in a project",
            description = "Retrieves a leaderboard of users in a specific project, summarizing their statistics (worked hours and completed tasks)")
    @GetMapping("/appusers/projects/{projectId}/leaderboard")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<List<ProjectUserStatisticsSummary>> getProjectUsersSummaryResponses(
            @PathVariable Long projectId) {
        return ResponseEntity.ok(statisticsService.getProjectUsersSummaryResponses(projectId));
    }


}
