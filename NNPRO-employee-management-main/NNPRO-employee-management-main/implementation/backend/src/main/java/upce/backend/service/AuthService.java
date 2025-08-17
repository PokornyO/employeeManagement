package upce.backend.service;

import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import upce.backend.dto.auth.LoginResponse;
import upce.backend.dto.auth.RegisterRequest;
import upce.backend.entity.*;
import upce.backend.exception.FieldAlreadyExistsException;
import upce.backend.security.JwtIssuer;
import upce.backend.security.UserPrincipal;

import java.util.List;

@Service
@AllArgsConstructor
public class AuthService {

    private final JwtIssuer jwtIssuer;

    private final AuthenticationManager authenticationManager;

    private final AppUserService appUserService;

    private final RoleService roleService;

    private final PasswordEncoder passwordEncoder;

    private final TaskService taskService;

    private final ProjectService projectService;

    private final PerformanceReportService performanceReportService;

    private final CommentService commentService;

    public LoginResponse login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        String role = principal.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElseThrow(() -> new IllegalStateException("User does not have any role assigned"));

        String token = jwtIssuer.issue(principal.getUserId());

        return LoginResponse.builder()
                .accessToken(token)
                .userId(principal.getUserId())
                .username(principal.getUsername())
                .email(principal.getEmail())
                .firstName(principal.getFirstName())
                .surname(principal.getSurname())
                .phoneNumber(principal.getPhoneNumber())
                .role(role)
                .build();
    }

    public LoginResponse register(RegisterRequest registerRequest) {

        if (appUserService.existsByUsername(registerRequest.getUsername())) {
            throw new FieldAlreadyExistsException("Username already exists");
        }

        if (appUserService.existsByEmail(registerRequest.getEmail())) {
            throw new FieldAlreadyExistsException("Email already exists");
        }

        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
        Role role = roleService.findByName("ROLE_EMPLOYEE");

        AppUser newUser = new AppUser();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setPassword(encodedPassword);
        newUser.setEmail(registerRequest.getEmail());
        newUser.setFirstName(registerRequest.getFirstName());
        newUser.setSurname(registerRequest.getSurname());
        newUser.setPhoneNumber(registerRequest.getPhoneNumber());
        newUser.setRole(role);

        appUserService.create(newUser);

        return login(registerRequest.getUsername(), registerRequest.getPassword());
    }
    public boolean isUserInPerformanceReport(Long performanceReportId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser loggedUser = appUserService.findByUsername(username);
        PerformanceReport report = performanceReportService.findById(performanceReportId);
        return report.getAppUser().getId().equals(loggedUser.getId());
    }

    public boolean isLeaderOfProject(Long projectId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = appUserService.findByUsername(username);
        Project project = projectService.findById(projectId);
        return project.getLeader().getId().equals(user.getId());
    }

    public boolean isMemberOfProject(Long projectId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = appUserService.findByUsername(username);
        List<AppUser> appUsers = appUserService.findUsersByProjectId(projectId);
        return appUsers.contains(user);
    }

    public boolean isLeaderOrMemberOfProjectByProjectId(Long projectId) {
        return isLeaderOfProject(projectId) || isMemberOfProject(projectId);
    }

    public boolean isLeaderOfProjectByTaskId(Long taskId) {
        Task task = taskService.findById(taskId);
        Long projectId = task.getProject().getId();
        return isLeaderOfProject(projectId);
    }

    public boolean isLeaderOrMemberOfProjectByTaskId(Long taskId) {
        Task task = taskService.findById(taskId);
        Long projectId = task.getProject().getId();
        return isLeaderOrMemberOfProjectByProjectId(projectId);
    }

    public boolean isUser(Long userId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = appUserService.findByUsername(username);
        return userId.equals(user.getId());
    }

    public boolean isUserInComment(Long commentId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser loggedUser = appUserService.findByUsername(username);
        Comment comment = commentService.findById(commentId);
        return comment.getUser().getId().equals(loggedUser.getId());
    }
}
