package upce.backend.dto.task;

import lombok.Builder;
import lombok.Getter;
import upce.backend.dto.appUser.AppUserResponse;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class TaskResponse {
    private Long id;

    private String title;

    private String description;

    private LocalDateTime creationDate;

    private LocalDateTime dueDate;

    private LocalDateTime expectedFinishDate;

    private LocalDateTime finishDate;

    private TaskDifficultyResponse difficulty;

    private TaskStatusResponse status;

    private List<AppUserResponse> assignedUsers;
}
