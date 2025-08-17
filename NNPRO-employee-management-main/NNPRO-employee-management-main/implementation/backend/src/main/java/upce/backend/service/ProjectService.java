package upce.backend.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import upce.backend.dto.project.ProjectRequest;
import upce.backend.entity.AppUser;
import upce.backend.entity.Project;
import upce.backend.exception.ResourceNotFoundException;
import upce.backend.mapper.ProjectMapper;
import upce.backend.repository.ProjectRepository;

@Service
@AllArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final AppUserService appUserService;
    private final ProjectMapper projectMapper;

    public Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found."));
    }

    public Page<Project> findAllProjects(Pageable pageable) {
        return projectRepository.findAllProjects(pageable);
    }

    public Page<Project> findAppUserLeaderProjects(Long appUserId, Pageable pageable) {
        return projectRepository.findLeaderProjectsByAppUserId(appUserId, pageable);
    }

    public Page<Project> findAppUserProjects(Long appUserId, Pageable pageable) {
        return projectRepository.findAppUserProjects(appUserId, pageable);
    }

    public Page<Project> findProjectsByAppUserIdInTasks(Long appUserId, Pageable pageable) {
        return projectRepository.findByAppUserIdInTasks(appUserId, pageable);
    }

    @Transactional
    public Project create(ProjectRequest projectRequest) {
        AppUser appUser = appUserService.findById(projectRequest.getAppUserId());
        return projectRepository.save(projectMapper.toEntity(projectRequest, appUser));
    }

    @Transactional
    public Project update(Long id, ProjectRequest projectRequest) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        if (projectRequest.getAppUserId() != null) {
            AppUser appUser = appUserService.findById(projectRequest.getAppUserId());
            projectMapper.setProjectFields(projectRequest, project, appUser);
        } else {
            projectMapper.setProjectFields(projectRequest, project);
        }
        return projectRepository.save(project);
    }

    @Transactional
    public void delete(Long id) {
        projectRepository.deleteById(id);
    }
}
