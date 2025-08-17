package upce.backend.mapper;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import upce.backend.dto.project.ProjectRequest;
import upce.backend.dto.project.ProjectResponse;
import upce.backend.entity.AppUser;
import upce.backend.entity.Project;
import upce.backend.enums.ProjectStatus;

@Component
@AllArgsConstructor
public class ProjectMapper {

    private final AppUserMapper appUserMapper;
    private final ProjectStatusMapper projectStatusMapper;

    public Project toEntity(ProjectRequest projectRequest, AppUser appUser) {
        Project project = new Project();
        setProjectFields(projectRequest, project, appUser);
        return project;
    }
    public void setProjectFields(ProjectRequest projectRequest, Project project, AppUser appUser) {
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setDueDate(projectRequest.getDueDate());
        project.setFinishDate(projectRequest.getFinishDate());
        project.setStatus(ProjectStatus.valueOf(projectRequest.getStatus()));
        project.setLeader(appUser);
    }

    public void setProjectFields(ProjectRequest projectRequest, Project project) {
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setDueDate(projectRequest.getDueDate());
        project.setFinishDate(projectRequest.getFinishDate());
        project.setStatus(ProjectStatus.valueOf(projectRequest.getStatus()));
    }

    public ProjectResponse toDto(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .creationDate(project.getCreationDate())
                .dueDate(project.getDueDate())
                .finishDate(project.getFinishDate())
                .status(projectStatusMapper.toDto(project.getStatus()))
                .leader(appUserMapper.toDto(project.getLeader()))
                .build();
    }
}
