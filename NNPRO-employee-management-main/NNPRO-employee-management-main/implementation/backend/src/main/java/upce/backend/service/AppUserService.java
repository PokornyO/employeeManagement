package upce.backend.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import upce.backend.dto.appUser.AppUserRequest;
import upce.backend.entity.AppUser;
import upce.backend.entity.Project;
import upce.backend.entity.Task;
import upce.backend.exception.BadRequestException;
import upce.backend.exception.FieldAlreadyExistsException;
import upce.backend.exception.ResourceNotFoundException;
import upce.backend.mapper.AppUserMapper;
import upce.backend.repository.AppUserRepository;
import upce.backend.repository.ProjectRepository;
import upce.backend.repository.TaskRepository;

import java.util.List;


@Service
@AllArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;

    private final ProjectRepository projectRepository;

    private final AppUserMapper appUserMapper;

    private final TaskRepository taskRepository;


    public Page<AppUser> findAllAppUsers(Pageable pageable) {
        return appUserRepository.findAllAppUsers(pageable);
    }

    public Page<AppUser> findAllEmployees(Pageable pageable) {
        return appUserRepository.findAllEmployees(pageable);
    }

    public Page<AppUser> findEmployeeByInputString(Pageable pageable, String inputString) {
        return appUserRepository.findAppUserByInputString(pageable, inputString);
    }

    public Page<AppUser> findUsersByProjectId(Pageable pageable, Long projectId) {
        return appUserRepository.findAllUsersByProjectId(pageable, projectId);
    }
    public List<AppUser> findUsersByProjectId(Long projectId) {
        return appUserRepository.findAllUsersByProjectId(projectId);
    }

    public Page<AppUser> findUsersByTaskId(Pageable pageable, Long taskId) {
        return appUserRepository.findAllUsersByTaskId(pageable, taskId);
    }

    @Transactional
    public AppUser create(AppUserRequest appUserRequest) {
        return appUserRepository.save(appUserMapper.toEntity(appUserRequest));
    }

    @Transactional
    public AppUser create(AppUser appUser) {
        return appUserRepository.save(appUser);
    }

    @Transactional
    public AppUser update(AppUser appUser) {
        return appUserRepository.save(appUser);
    }

    @Transactional
    public AppUser update(Long id, AppUserRequest appUserRequest) {
        AppUser appUser = appUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        appUserMapper.setAppUserFields(appUserRequest, appUser);
        return appUserRepository.save(appUser);
    }

    @Transactional
    public void delete(Long id) {
        appUserRepository.deleteById(id);
    }

    @Transactional
    public void addTask(Long appUserId, Long taskId) {
        AppUser appUser = appUserRepository.findById(appUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<AppUser> taskUsers = appUserRepository.findAllUsersByTaskId(taskId);
        if(taskUsers.contains(appUser)) {
            throw new FieldAlreadyExistsException("User is already member of this task");
        }
        if(!appUser.getAppuserProjects().contains(task.getProject())) {
            throw new BadRequestException("User is not a member of this project");
        }
        appUser.getTasks().add(task);
        appUserRepository.save(appUser);
    }

    @Transactional
    public void addUserToProject(Long userId, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + projectId));
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
        if(project.getAppUsers().contains(user)) {
            throw new FieldAlreadyExistsException("User is already member of this project");
        }
        user.getAppuserProjects().add(project);
        projectRepository.save(project);
    }

    @Transactional
    public void removeUserFromProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + projectId));
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        user.getAppuserProjects().remove(project);
        projectRepository.save(project);
    }

    public boolean existsByUsername(String username) {
        return appUserRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return appUserRepository.existsByEmail(email);
    }

    public AppUser findByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    public AppUser findById(Long id) {
        return appUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(("User not found")));
    }
}
