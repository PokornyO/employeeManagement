package upce.backend.dto.task;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TaskDifficultyResponse {

    private String name;

    private String label;
}
