package upce.backend.dto.task;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TaskRequest {

    @NotBlank(message = "Title is mandatory")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;

    @NotBlank(message = "Description is mandatory")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;

    @NotNull(message = "Due date is mandatory")
    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;

    @PastOrPresent(message = "Finish date must be in the past or present")
    private LocalDateTime finishDate;

    @NotBlank(message = "Difficulty is mandatory")
    @Size(min = 3, max = 20, message = "Difficulty must be between 3 and 20 characters")
    private String difficulty;

    @NotBlank(message = "Status is mandatory")
    @Size(min = 3, max = 20, message = "Status must be between 3 and 20 characters")
    private String status;

    @NotNull(message = "Project ID is mandatory")
    private Long projectId;
}
