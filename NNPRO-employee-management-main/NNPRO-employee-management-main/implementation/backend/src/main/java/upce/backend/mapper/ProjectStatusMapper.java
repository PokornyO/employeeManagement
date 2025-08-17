package upce.backend.mapper;

import org.springframework.stereotype.Component;
import upce.backend.dto.project.ProjectStatusResponse;
import upce.backend.enums.ProjectStatus;

@Component
public class ProjectStatusMapper {

    public ProjectStatusResponse toDto(ProjectStatus projectStatus) {
        return ProjectStatusResponse.builder()
                .name(projectStatus.name())
                .label(projectStatus.getLabel())
                .build();
    }
}
