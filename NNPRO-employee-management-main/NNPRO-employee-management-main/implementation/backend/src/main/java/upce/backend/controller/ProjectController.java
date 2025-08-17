package upce.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import upce.backend.dto.project.ProjectRequest;
import upce.backend.dto.project.ProjectResponse;
import upce.backend.entity.Project;
import upce.backend.mapper.ProjectMapper;
import upce.backend.service.ProjectService;

@RestController
@AllArgsConstructor
@Tag(name = "Project", description = "Operations related to projects")
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectMapper projectMapper;

    @Operation(summary = "Get all projects",
            description = "Retrieves a paginated list of all projects in the database")
    @GetMapping("/projects")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<ProjectResponse>> findAll(Pageable pageable) {
        Page<Project> projects = projectService.findAllProjects(pageable);
        Page<ProjectResponse> projectResponses = projects.map(projectMapper::toDto);
        return ResponseEntity.ok(projectResponses);
    }

    @Operation(summary = "Get all leader projects for a user",
            description = "Retrieves a paginated list of projects where the specified user is a leader")
    @GetMapping("/appUsers/{userId}/leader-projects")
    @PreAuthorize("hasRole('ROLE_LEADER')")
    public ResponseEntity<Page<ProjectResponse>> findAppUserLeaderProjects(@PathVariable Long userId, Pageable pageable) {
        Page<Project> projects = projectService.findAppUserLeaderProjects(userId, pageable);
        Page<ProjectResponse> projectResponses = projects.map(projectMapper::toDto);
        return ResponseEntity.ok(projectResponses);
    }

    @Operation(summary = "Get all projects assigned to a user (based on tasks)",
            description = "Retrieves a paginated list of projects where the specified user is assigned to tasks")
    @GetMapping("/appUsers/{userId}/projects")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<Page<ProjectResponse>> findProjectsByAppUserInTasks(@PathVariable Long userId, Pageable pageable) {
        Page<Project> projects = projectService.findProjectsByAppUserIdInTasks(userId, pageable);
        Page<ProjectResponse> projectResponses = projects.map(projectMapper::toDto);
        return ResponseEntity.ok(projectResponses);
    }

    @Operation(summary = "Get all projects assigned or led by a user",
            description = "Retrieves a paginated list of projects where the specified user is assigned or a leader")
    @GetMapping("/appUsers/{userId}/my-projects")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<Page<ProjectResponse>> findProjectsByAppUser(@PathVariable Long userId, Pageable pageable) {
        Page<Project> projects = projectService.findAppUserProjects(userId, pageable);
        Page<ProjectResponse> projectResponses = projects.map(projectMapper::toDto);
        return ResponseEntity.ok(projectResponses);
    }

    @Operation(summary = "Get details of a project by project ID", description = "Retrieves detailed information about a project by its ID")
    @GetMapping("/projects/{projectId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOfProject(#projectId) or @authService.isMemberOfProject(#projectId)")
    public ResponseEntity<ProjectResponse> findByProjectId(@PathVariable Long projectId) {
        Project project = projectService.findById(projectId);
        ProjectResponse projectResponse = projectMapper.toDto(project);
        return ResponseEntity.ok(projectResponse);
    }

    @Operation(summary = "Create new project", description = "Creates a new project based on the provided project request.")
    @PostMapping("/projects")
    @PreAuthorize("hasRole('ROLE_LEADER')")
    public ResponseEntity<ProjectResponse> create(@RequestBody @Validated ProjectRequest projectRequest) {
        Project project = projectService.create(projectRequest);
        return new ResponseEntity<>(projectMapper.toDto(project), HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing project", description = "Updates  project based on its ID")
    @PutMapping("/projects/{projectId}")
    @PreAuthorize("hasRole('ROLE_LEADER')")
    public ResponseEntity<ProjectResponse> update(@PathVariable Long projectId,
                                                  @RequestBody @Validated ProjectRequest projectRequest) {
        Project updatedProject = projectService.update(projectId, projectRequest);
        return ResponseEntity.ok(projectMapper.toDto(updatedProject));
    }

    @Operation(summary = "Delete project", description = "Deletes an existing project by its ID.")
    @DeleteMapping("/projects/{projectId}")
    @PreAuthorize("hasRole('ROLE_LEADER')")
    public ResponseEntity<Void> delete(@PathVariable Long projectId) {
        projectService.delete(projectId);
        return ResponseEntity.noContent().build();
    }
}