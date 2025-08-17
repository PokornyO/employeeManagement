package upce.backend.dto.statistics;

import lombok.Builder;
import lombok.Getter;
import upce.backend.dto.project.ProjectResponse;

@Getter
@Builder
public class SingleProjectStatisticsResponse {

    private int totalTasks;

    private int todoTasks;

    private int inProgressTasks;

    private int toBeReviewedTasks;

    private int completedTasks;

    private int completedTasksOnTime;

    private int completedTasksLate;

    private ProjectResponse project;
}
