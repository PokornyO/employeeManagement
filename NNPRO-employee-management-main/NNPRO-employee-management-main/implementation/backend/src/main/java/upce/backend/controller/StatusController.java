package upce.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import upce.backend.dto.project.ProjectStatusResponse;
import upce.backend.dto.task.TaskDifficultyResponse;
import upce.backend.dto.task.TaskStatusResponse;
import upce.backend.enums.ProjectStatus;
import upce.backend.enums.TaskDifficulty;
import upce.backend.enums.TaskStatus;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@Tag(name = "Status", description = "Endpoints for retrieving status and difficulty levels of projects and tasks")
public class StatusController {

    @Operation(summary = "Get project statuses", description = "Retrieve all possible statuses for projects")
    @GetMapping("/project-statuses")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public List<ProjectStatusResponse> getProjectStatuses() {
        return Arrays.stream(ProjectStatus.values())
                .map(status -> ProjectStatusResponse.builder()
                        .name(status.name())
                        .label(status.getLabel())
                        .build())
                .collect(Collectors.toList());
    }

    @Operation(summary = "Get task statuses", description = "Retrieve all possible statuses for tasks")
    @GetMapping("/task-statuses")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public List<TaskStatusResponse> getTaskStatuses() {
        return Arrays.stream(TaskStatus.values())
                .map(status -> TaskStatusResponse.builder()
                        .name(status.name())
                        .label(status.getLabel())
                        .build())
                .collect(Collectors.toList());
    }

    @Operation(summary = "Get task difficulty levels", description = "Retrieve all possible difficulty levels for tasks")
    @GetMapping("/task-difficulty-levels")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public List<TaskDifficultyResponse> getTaskDifficulties() {
        return Arrays.stream(TaskDifficulty.values())
                .map(status -> TaskDifficultyResponse.builder()
                        .name(status.name())
                        .label(status.getLabel())
                        .build())
                .collect(Collectors.toList());
    }
}
