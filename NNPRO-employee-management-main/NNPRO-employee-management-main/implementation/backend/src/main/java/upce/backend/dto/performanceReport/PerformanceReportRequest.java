package upce.backend.dto.performanceReport;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PerformanceReportRequest {

    @NotNull(message = "Overall rating is mandatory")
    @Positive(message = "Overall rating must be a positive number")
    private Double overallRating;

    @NotBlank(message = "Feedback cannot be empty")
    private String feedback;

    @NotNull(message = "User ID is mandatory")
    private Long userId;

    @NotNull(message = "Task ID is mandatory")
    private Long taskId;
}
