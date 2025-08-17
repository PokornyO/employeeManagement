package upce.backend.dto.statistics;

import lombok.Builder;
import lombok.Getter;
import upce.backend.dto.appUser.AppUserResponse;

@Getter
@Builder
public class ProjectUserStatisticsSummary {

    private int completedTasks;

    private double workedHours;

    private AppUserResponse appuser;
}
