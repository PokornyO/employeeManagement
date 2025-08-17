package upce.backend.dto.attendance;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceRequest {

    @NotNull(message = "Start time cannot be null.")
    @PastOrPresent(message = "Start time must be in the past or present.")
    private LocalDateTime startTime;

    @NotNull(message = "End time cannot be null.")
    @FutureOrPresent(message = "End time must be in the future or present.")
    private LocalDateTime endTime;

    @NotNull(message = "Task ID cannot be null.")
    private Long taskId;

    @NotNull(message = "User ID cannot be null.")
    private Long appUserId;

    private String workDescription;

    @AssertTrue(message = "End time must be after start time.")
    public boolean isEndTimeAfterStartTime() {
        return endTime.isAfter(startTime);
    }
}
