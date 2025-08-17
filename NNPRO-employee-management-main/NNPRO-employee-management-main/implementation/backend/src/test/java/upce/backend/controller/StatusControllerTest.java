package upce.backend.controller;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import upce.backend.enums.ProjectStatus;
import upce.backend.enums.TaskDifficulty;
import upce.backend.enums.TaskStatus;

import java.util.Arrays;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.collection.IsIterableContainingInAnyOrder.containsInAnyOrder;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class StatusControllerTest {

    @Autowired
    private MockMvc api;

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void testGetProjectStatusesAsEmployee() throws Exception {
        api.perform(get("/project-statuses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(ProjectStatus.values().length)))
                .andExpect(jsonPath("$[*].name", containsInAnyOrder(
                        Arrays.stream(ProjectStatus.values())
                                .map(ProjectStatus::name)
                                .toArray()
                )))
                .andExpect(jsonPath("$[*].label", containsInAnyOrder(
                        Arrays.stream(ProjectStatus.values())
                                .map(ProjectStatus::getLabel)
                                .toArray()
                )));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void testGetTaskStatusesAsEmployee() throws Exception {
        api.perform(get("/task-statuses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(TaskStatus.values().length)))
                .andExpect(jsonPath("$[*].name", containsInAnyOrder(
                        Arrays.stream(TaskStatus.values())
                                .map(TaskStatus::name)
                                .toArray()
                )))
                .andExpect(jsonPath("$[*].label", containsInAnyOrder(
                        Arrays.stream(TaskStatus.values())
                                .map(TaskStatus::getLabel)
                                .toArray()
                )));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void testGetTaskDifficultyLevelsAsEmployee() throws Exception {
        api.perform(get("/task-difficulty-levels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(TaskDifficulty.values().length)))
                .andExpect(jsonPath("$[*].name", containsInAnyOrder(
                        Arrays.stream(TaskDifficulty.values())
                                .map(TaskDifficulty::name)
                                .toArray()
                )))
                .andExpect(jsonPath("$[*].label", containsInAnyOrder(
                        Arrays.stream(TaskDifficulty.values())
                                .map(TaskDifficulty::getLabel)
                                .toArray()
                )));
    }
}