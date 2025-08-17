package upce.backend.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import upce.backend.dto.task.TaskRequest;
import upce.backend.entity.Project;
import upce.backend.entity.Task;
import upce.backend.enums.TaskDifficulty;
import upce.backend.exception.ResourceNotFoundException;
import upce.backend.mapper.TaskMapper;
import upce.backend.repository.TaskRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final TaskMapper taskMapper;

    public Task findById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));
    }

    public Page<Task> findAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    public Page<Task> findTasksByProjectIdAndDueDate(Long projectId, LocalDateTime minDueDate, LocalDateTime maxDueDate, Pageable pageable) {
        if (minDueDate != null && maxDueDate != null) {
            return taskRepository.findByProjectIdAndDueDateBetween(projectId, minDueDate, maxDueDate, pageable);
        } else if (minDueDate != null) {
            return taskRepository.findByProjectIdAndDueDateAfter(projectId, minDueDate, pageable);
        } else if (maxDueDate != null) {
            return taskRepository.findByProjectIdAndDueDateBefore(projectId, maxDueDate, pageable);
        } else {
            return taskRepository.findByProjectId(projectId, pageable);
        }
    }

    public Page<Task> findByAppUserId(Long id, Pageable pageable) {
        return taskRepository.findByAppUserId(id, pageable);
    }

    @Transactional
    public Task create(TaskRequest taskRequest) {
        Project project = projectService.findById(taskRequest.getProjectId());
        Task task = taskMapper.toEntity(taskRequest, project);
        return taskRepository.save(task);
    }

    @Transactional
    public Task update(Long id, TaskRequest taskRequest) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        if (taskRequest.getProjectId() != null) {
            Project project = projectService.findById(taskRequest.getProjectId());
            taskMapper.setTaskFields(taskRequest, task, project);
        } else {
            taskMapper.setTaskFields(taskRequest, task);
        }
        return taskRepository.save(task);
    }

    @Transactional
    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    public Map<TaskDifficulty, LocalDateTime> getEstimatedFinishDateForNewTask() {
        Map<TaskDifficulty, LocalDateTime> estimatedFinishDates = new HashMap<>();

        for (TaskDifficulty difficulty : TaskDifficulty.values()) {
            List<Task> completedTasks = taskRepository.findCompletedTasksByDifficulty(difficulty);

            int defaultTaskDuration = 0;
            switch(difficulty){
                case EASY -> defaultTaskDuration = 3;
                case MEDIUM -> defaultTaskDuration = 6;
                case HARD -> defaultTaskDuration = 9;
            }

            if (completedTasks.isEmpty()) {
                estimatedFinishDates.put(difficulty, LocalDateTime.now().plusDays(defaultTaskDuration));
                continue;
            }

            long totalTimeSpent = 0;
            long totalWorkedHours = 0;

            for (Task task : completedTasks) {
                long timeSpent = Duration.between(task.getCreationDate(), task.getFinishDate()).toHours();
                totalTimeSpent += timeSpent;

                long taskWorkedHours = task.getAttendances().stream()
                        .mapToLong(a -> Duration.between(a.getStartTime(), a.getEndTime()).toHours())
                        .sum();

                totalWorkedHours += taskWorkedHours;
            }

            long averageTimeSpent = totalTimeSpent / completedTasks.size();

            if (totalWorkedHours > 0) {
                double hoursFactor = (double) totalWorkedHours / totalTimeSpent;
                averageTimeSpent = (long) (averageTimeSpent  * (0.8 + hoursFactor));
            }

            estimatedFinishDates.put(difficulty, LocalDateTime.now().plusHours(averageTimeSpent));
        }
        return estimatedFinishDates;
    }
}


