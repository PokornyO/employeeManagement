package upce.backend.dto.comment;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import upce.backend.dto.appUser.AppUserResponse;
import upce.backend.dto.task.TaskResponse;
import upce.backend.entity.AppUser;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String text;
    private LocalDateTime createdDate;
    private TaskResponse task;
    private AppUserResponse appUser;
}
