package upce.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import upce.backend.entity.Attendance;
import upce.backend.entity.Task;
import upce.backend.enums.TaskDifficulty;
import upce.backend.repository.TaskRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @InjectMocks
    private TaskService taskService;

    @Mock
    private TaskRepository taskRepository;

    @Test
    void testGetEstimatedFinishDateForNewTask() {
        when(taskRepository.findCompletedTasksByDifficulty(TaskDifficulty.EASY))
                .thenReturn(Collections.emptyList());

        Task mediumTask = new Task();
        mediumTask.setCreationDate(LocalDateTime.now().minusDays(6));
        mediumTask.setFinishDate(LocalDateTime.now().minusDays(3));
        Attendance mediumAttendance = new Attendance();
        mediumAttendance.setStartTime(LocalDateTime.now().minusDays(5));
        mediumAttendance.setEndTime(LocalDateTime.now().minusDays(4));
        mediumTask.setAttendances(List.of(mediumAttendance));
        when(taskRepository.findCompletedTasksByDifficulty(TaskDifficulty.MEDIUM))
                .thenReturn(Collections.singletonList(mediumTask));

        Task hardTask1 = new Task();
        hardTask1.setCreationDate(LocalDateTime.now().minusDays(12));
        hardTask1.setFinishDate(LocalDateTime.now().minusDays(7));
        hardTask1.setAttendances(Collections.emptyList());

        Task hardTask2 = new Task();
        hardTask2.setCreationDate(LocalDateTime.now().minusDays(9));
        hardTask2.setFinishDate(LocalDateTime.now().minusDays(4));
        Attendance hardAttendance = new Attendance();
        hardAttendance.setStartTime(LocalDateTime.now().minusDays(8));
        hardAttendance.setEndTime(LocalDateTime.now().minusDays(7));
        hardTask2.setAttendances(List.of(hardAttendance));
        when(taskRepository.findCompletedTasksByDifficulty(TaskDifficulty.HARD))
                .thenReturn(List.of(hardTask1, hardTask2));

        Map<TaskDifficulty, LocalDateTime> result = taskService.getEstimatedFinishDateForNewTask();

        assertNotNull(result);
        assertEquals(3, result.size());

        assertTrue(result.containsKey(TaskDifficulty.EASY));
        assertTrue(result.get(TaskDifficulty.EASY).isAfter(LocalDateTime.now()));

        assertTrue(result.containsKey(TaskDifficulty.MEDIUM));
        assertTrue(result.get(TaskDifficulty.MEDIUM).isAfter(LocalDateTime.now()));

        assertTrue(result.containsKey(TaskDifficulty.HARD));
        assertTrue(result.get(TaskDifficulty.HARD).isAfter(LocalDateTime.now()));

        verify(taskRepository, times(1)).findCompletedTasksByDifficulty(TaskDifficulty.EASY);
        verify(taskRepository, times(1)).findCompletedTasksByDifficulty(TaskDifficulty.MEDIUM);
        verify(taskRepository, times(1)).findCompletedTasksByDifficulty(TaskDifficulty.HARD);
    }

}