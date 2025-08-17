package upce.backend.mapper;

import org.springframework.stereotype.Component;
import upce.backend.dto.task.TaskDifficultyResponse;
import upce.backend.enums.TaskDifficulty;

@Component
public class TaskDifficultyMapper {

    public TaskDifficultyResponse toDto(TaskDifficulty taskDifficulty) {
        return TaskDifficultyResponse.builder()
                .name(taskDifficulty.name())
                .label(taskDifficulty.getLabel())
                .build();
    }
}
