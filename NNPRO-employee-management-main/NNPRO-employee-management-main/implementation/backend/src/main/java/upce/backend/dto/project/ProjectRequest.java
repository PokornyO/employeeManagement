package upce.backend.dto.project;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProjectRequest {

    @NotBlank(message = "Project name is mandatory")
    private String name;

    private String description;

    @NotNull(message = "Due date is mandatory")
    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;

    @PastOrPresent(message = "Finish date must be in the past or present")
    private LocalDateTime finishDate;

    @NotBlank(message = "Status is mandatory")
    @Size(min = 3, max = 20, message = "Status must be between 3 and 20 characters")
    private String status;

    @NotNull(message = "App user ID is mandatory")
    private Long appUserId;
}