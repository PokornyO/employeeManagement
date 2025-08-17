package upce.backend.dto.task;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TaskStatusResponse {

    private String name;

    private String label;


}
