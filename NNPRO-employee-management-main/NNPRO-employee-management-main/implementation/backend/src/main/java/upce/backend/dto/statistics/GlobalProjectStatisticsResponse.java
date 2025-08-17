package upce.backend.dto.statistics;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GlobalProjectStatisticsResponse {

    private long totalProjects;

    private int plannedProjects;

    private int inProgressProjects;

    private int completedProjects;

    private int completedProjectsOnTime;

    private int completedProjectsLate;

    private int cancelledProjects;
}
