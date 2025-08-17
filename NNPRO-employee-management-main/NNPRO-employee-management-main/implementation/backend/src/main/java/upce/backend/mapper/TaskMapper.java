package upce.backend.mapper;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import upce.backend.dto.task.TaskRequest;
import upce.backend.dto.task.TaskResponse;
import upce.backend.entity.Project;
import upce.backend.entity.Task;
import upce.backend.enums.TaskDifficulty;
import upce.backend.enums.TaskStatus;

import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class TaskMapper {

    private final TaskStatusMapper taskStatusMapper;
    private final TaskDifficultyMapper taskDifficultyMapper;
    private final AppUserMapper appUserMapper;

    public Task toEntity(TaskRequest taskRequest, Project project) {
        Task task = new Task();
        setTaskFields(taskRequest, task, project);
        return task;
    }

    public void setTaskFields(TaskRequest taskRequest, Task task, Project project) {
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDueDate(taskRequest.getDueDate());
        task.setFinishDate(taskRequest.getFinishDate());
        task.setDifficulty(TaskDifficulty.valueOf(taskRequest.getDifficulty()));
        task.setStatus(TaskStatus.valueOf(taskRequest.getStatus()));
        task.setProject(project);
    }

    public void setTaskFields(TaskRequest taskRequest, Task task) {
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDueDate(taskRequest.getDueDate());
        task.setFinishDate(taskRequest.getFinishDate());
        task.setDifficulty(TaskDifficulty.valueOf(taskRequest.getDifficulty()));
        task.setStatus(TaskStatus.valueOf(taskRequest.getStatus()));
    }

    public TaskResponse toDto(Task task) {


        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .creationDate(task.getCreationDate())
                .dueDate(task.getDueDate())
                .finishDate(task.getFinishDate())
                .difficulty(taskDifficultyMapper.toDto(task.getDifficulty()))
                .status(taskStatusMapper.toDto(task.getStatus()))
                .assignedUsers(task.getAppUsers().stream().map(appUserMapper::toDto).collect(Collectors.toList()))
                .build();
    }
}

