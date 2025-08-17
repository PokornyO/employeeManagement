package upce.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import upce.backend.dto.task.TaskRequest;
import upce.backend.dto.task.TaskResponse;
import upce.backend.entity.Task;
import upce.backend.enums.TaskDifficulty;
import upce.backend.mapper.TaskMapper;
import upce.backend.service.TaskService;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@AllArgsConstructor
@Tag(name = "Tasks", description = "Manage tasks for users and projects")
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    @Operation(summary = "Get all tasks", description = "Retrieve all tasks with pagination")
    @GetMapping("/tasks")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<TaskResponse>> findAll(Pageable pageable) {
        Page<Task> tasks = taskService.findAllTasks(pageable);
        Page<TaskResponse> taskResponses = tasks.map(taskMapper::toDto);
        return ResponseEntity.ok(taskResponses);
    }

    @Operation(summary = "Get a specific task by ID", description = "Retrieve a task by its ID")
    @GetMapping("/tasks/{taskId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOrMemberOfProjectByTaskId(#taskId)")
    public ResponseEntity<TaskResponse> findTask(@PathVariable Long taskId) {
        Task task = taskService.findById(taskId);
        TaskResponse taskResponses = taskMapper.toDto(task);
        return ResponseEntity.ok(taskResponses);
    }

    @Operation(summary = "Get tasks assigned to a specific user", description = "Retrieve tasks assigned to a user with pagination")
    @GetMapping("/appusers/{userId}/tasks")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<Page<TaskResponse>> findTasksByUserId(@PathVariable Long userId, Pageable pageable) {
        Page<Task> tasks = taskService.findByAppUserId(userId, pageable);
        Page<TaskResponse> taskResponses = tasks.map(taskMapper::toDto);
        return ResponseEntity.ok(taskResponses);
    }

    @Operation(summary = "Get tasks for a specific project", description = "Retrieve tasks for a project with optional due date filters")
    @GetMapping("/projects/{projectId}/tasks")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOfProject(#projectId) or @authService.isMemberOfProject(#projectId)")
    public ResponseEntity<Page<TaskResponse>> findTasksByProjectId(
            @PathVariable Long projectId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime minDueDate, //2024-11-28T00:00:00
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime maxDueDate,
            Pageable pageable) {

        Page<Task> tasks = taskService.findTasksByProjectIdAndDueDate(projectId, minDueDate, maxDueDate, pageable);
        Page<TaskResponse> taskResponses = tasks.map(taskMapper::toDto);
        return ResponseEntity.ok(taskResponses);
    }

    @Operation(summary = "Get predicted finish dates for new tasks", description = "Get estimated finish dates based on task difficulty")
    @GetMapping("/tasks/taskFinishPrediction")
    @PreAuthorize("hasRole('ROLE_LEADER')")
    public ResponseEntity<Map<TaskDifficulty, LocalDateTime>> getEstimatedFinishDateForNewTask() {
        Map<TaskDifficulty, LocalDateTime> estimatedFinishDateForNewTask = taskService.getEstimatedFinishDateForNewTask();
        return ResponseEntity.ok(estimatedFinishDateForNewTask);
    }

    @Operation(summary = "Create a new task", description = "Create a new task with the provided details")
    @PostMapping("/tasks")
    @PreAuthorize("hasRole('ROLE_LEADER')")
    public ResponseEntity<TaskResponse> create(@RequestBody @Validated TaskRequest taskRequest) {
        Task task = taskService.create(taskRequest);
        return new ResponseEntity<>(taskMapper.toDto(task), HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing task", description = "Update the details of a task by its ID")
    @PutMapping("/tasks/{taskId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOfProjectByTaskId(#taskId)")
    public ResponseEntity<TaskResponse> update(
            @PathVariable Long taskId,
            @RequestBody @Validated TaskRequest taskRequest) {
        Task updatedTask = taskService.update(taskId, taskRequest);
        return ResponseEntity.ok(taskMapper.toDto(updatedTask));
    }

    @Operation(summary = "Delete a task", description = "Delete a task by its ID")
    @DeleteMapping("/tasks/{taskId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOfProjectByTaskId(#taskId)")
    public ResponseEntity<Void> delete(@PathVariable Long taskId) {
        taskService.delete(taskId);
        return ResponseEntity.noContent().build();
    }
}