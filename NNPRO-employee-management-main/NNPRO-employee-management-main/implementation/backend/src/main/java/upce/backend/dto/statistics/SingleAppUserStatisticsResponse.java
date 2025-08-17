package upce.backend.dto.statistics;

import lombok.Builder;
import lombok.Getter;
import upce.backend.dto.appUser.AppUserResponse;

@Getter
@Builder
public class SingleAppUserStatisticsResponse {

    private int totalTasks;

    private int completedTasks;

    private int completedTasksOnTime;

    private int completedTasksLate;

    private double totalHoursWorked;

    private double averageHoursPerTask;

    private AppUserResponse appUser;
}
