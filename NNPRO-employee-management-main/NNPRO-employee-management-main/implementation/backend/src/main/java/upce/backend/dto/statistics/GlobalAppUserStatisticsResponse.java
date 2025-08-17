package upce.backend.dto.statistics;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GlobalAppUserStatisticsResponse {

    private long totalUsers;

    private double totalHoursWorked;

    private double averageHoursPerTask;
}
