package upce.backend.dto.performanceReport;

import lombok.Builder;
import lombok.Data;
import upce.backend.dto.appUser.AppUserResponse;

import java.time.LocalDateTime;

@Data
@Builder
public class PerformanceReportResponse {
    private Long id;

    private LocalDateTime reviewDate;
    private Double overallRating;
    private String feedback;
    private AppUserResponse appUser;
    private Long taskId;
}
