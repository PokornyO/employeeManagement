package upce.backend.dto.statistics;


import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class DailyUserStatisticsResponse {

    private LocalDate date;

    private int totalCompletedTasks;

    private double totalWorkedHours;
}
