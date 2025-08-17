package upce.backend.dto.project;

import lombok.Builder;
import lombok.Getter;
import upce.backend.dto.appUser.AppUserResponse;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProjectResponse {

    private Long id;

    private String name;

    private String description;

    private LocalDateTime creationDate;

    private LocalDateTime dueDate;

    private LocalDateTime finishDate;

    private ProjectStatusResponse status;

    private AppUserResponse leader;
}
