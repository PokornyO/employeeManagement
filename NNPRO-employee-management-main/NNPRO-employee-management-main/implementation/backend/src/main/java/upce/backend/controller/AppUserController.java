package upce.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import upce.backend.dto.appUser.AppUserRequest;
import upce.backend.dto.appUser.AppUserResponse;
import upce.backend.entity.AppUser;
import upce.backend.mapper.AppUserMapper;
import upce.backend.service.AppUserService;


@RestController
@AllArgsConstructor
@Tag(name = "AppUsers", description = "Operations related to managing application users")
public class AppUserController {

    private final AppUserService appUserService;
    private final PasswordEncoder passwordEncoder;
    private final AppUserMapper appUserMapper;

    @Operation(summary = "Get all users", description = "Fetches all users with pagination")
    @GetMapping("/appusers")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<AppUserResponse>> findAll(Pageable pageable) {
        Page<AppUser> appUsers = appUserService.findAllAppUsers(pageable);
        Page<AppUserResponse> appUserResponses = appUsers.map(appUserMapper::toDto);
        return ResponseEntity.ok(appUserResponses);
    }

    @Operation(summary = "Get all employees", description = "Fetches all employees with pagination")
    @GetMapping("/appusers/employees")
    @PreAuthorize("hasRole('ROLE_LEADER')")
    public ResponseEntity<Page<AppUserResponse>> findAllEmployees(Pageable pageable) {
        Page<AppUser> appUsers = appUserService.findAllEmployees(pageable);
        Page<AppUserResponse> appUserResponses = appUsers.map(appUserMapper::toDto);
        return ResponseEntity.ok(appUserResponses);
    }

    @Operation(summary = "Get users by project", description = "Fetches users assigned to a specific project")
    @GetMapping("/appusers/projects/{projectId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOrMemberOfProjectByProjectId(#projectId)")
    public ResponseEntity<Page<AppUserResponse>> findUsersByProject(Pageable pageable, @PathVariable Long projectId) {
        Page<AppUser> appUsers = appUserService.findUsersByProjectId(pageable, projectId);
        Page<AppUserResponse> appUserResponses = appUsers.map(appUserMapper::toDto);
        return ResponseEntity.ok(appUserResponses);
    }

    @Operation(summary = "Search employees", description = "Find employees by input string with pagination")
    @GetMapping("/appusers/employee")
    @PreAuthorize("hasRole('ROLE_LEADER')")
    public ResponseEntity<Page<AppUserResponse>> findEmployeesByInputString(Pageable pageable, @RequestParam String inputString) {
        Page<AppUser> appUsers = appUserService.findEmployeeByInputString(pageable, inputString);
        Page<AppUserResponse> appUserResponses = appUsers.map(appUserMapper::toDto);
        return ResponseEntity.ok(appUserResponses);
    }

    @Operation(summary = "Get users by task", description = "Fetches users assigned to a specific task")
    @GetMapping("/appusers/tasks/{taskId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOrMemberOfProjectByTaskId(#taskId)")
    public ResponseEntity<Page<AppUserResponse>> findUsersByTask(Pageable pageable, @PathVariable Long taskId) {
        Page<AppUser> appUsers = appUserService.findUsersByTaskId(pageable, taskId);
        Page<AppUserResponse> appUserResponses = appUsers.map(appUserMapper::toDto);
        return ResponseEntity.ok(appUserResponses);
    }

    @Operation(summary = "Assign task to user", description = "Assigns a specific task to a user")
    @PostMapping("/appusers/{userId}/tasks/{taskId}/assign")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOrMemberOfProjectByTaskId(#taskId)")
    public ResponseEntity<Void> addTaskToUser(@PathVariable Long userId, @PathVariable Long taskId) {
        appUserService.addTask(userId, taskId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Assign user to project", description = "Adds a user to a specific project")
    @PostMapping("/appusers/{userId}/projects/{projectId}/assign")
    @PreAuthorize("(hasRole('ROLE_ADMIN') or @authService.isLeaderOfProject(#projectId))")
    public ResponseEntity<Void> addUserToProject(@PathVariable Long userId, @PathVariable Long projectId) {
        appUserService.addUserToProject(userId, projectId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Remove user from project", description = "Removes a user from a specific project")
    @PostMapping("/appusers/{userId}/projects/{projectId}/remove")
    @PreAuthorize("(hasRole('ROLE_ADMIN') or @authService.isLeaderOfProject(#projectId))")
    public ResponseEntity<Void> removeUserFromProject(@PathVariable Long userId, @PathVariable Long projectId) {
        appUserService.removeUserFromProject(projectId, userId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Operation(summary = "Create new user", description = "Creates a new user in the system")
    @PostMapping("/appusers")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AppUserResponse> create(@RequestBody @Validated AppUserRequest appUserRequest) {
        appUserRequest.setPassword(passwordEncoder.encode(appUserRequest.getPassword()));
        AppUser appUser = appUserService.create(appUserRequest);
        return new ResponseEntity<>(appUserMapper.toDto(appUser), HttpStatus.CREATED);
    }

    @Operation(summary = "Update user", description = "Updates an existing user")
    @PutMapping("/appusers/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AppUserResponse> update(
            @PathVariable Long userId,
            @RequestBody @Validated AppUserRequest appUserRequest) {
        if (appUserRequest.getPassword() != null && !appUserRequest.getPassword().isEmpty()) {
            appUserRequest.setPassword(passwordEncoder.encode(appUserRequest.getPassword()));
        }
        AppUser appUser = appUserService.update(userId, appUserRequest);
        return ResponseEntity.ok(appUserMapper.toDto(appUser));
    }

    @Operation(summary = "Delete user", description = "Deletes a user by ID")
    @DeleteMapping("/appusers/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long userId) {
        appUserService.delete(userId);
        return ResponseEntity.noContent().build();
    }
}

