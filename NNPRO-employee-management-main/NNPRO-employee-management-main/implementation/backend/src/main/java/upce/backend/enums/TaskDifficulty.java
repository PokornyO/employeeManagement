package upce.backend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TaskDifficulty {
    EASY("Jednoduché"),
    MEDIUM("Středně těžké"),
    HARD("Obtížné");

    private final String label;
}


