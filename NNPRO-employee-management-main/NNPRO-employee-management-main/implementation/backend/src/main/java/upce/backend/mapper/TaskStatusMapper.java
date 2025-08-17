package upce.backend.mapper;

import org.springframework.stereotype.Component;
import upce.backend.dto.task.TaskStatusResponse;
import upce.backend.enums.TaskStatus;

@Component
public class TaskStatusMapper {

    public TaskStatusResponse toDto(TaskStatus taskStatus) {
        return TaskStatusResponse.builder()
                .name(taskStatus.name())
                .label(taskStatus.getLabel())
                .build();
    }
}
