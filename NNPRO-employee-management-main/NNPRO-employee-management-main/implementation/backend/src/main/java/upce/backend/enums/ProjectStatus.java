package upce.backend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ProjectStatus {
    PLANNED("Plánováno"),
    IN_PROGRESS("Probíhá"),
    COMPLETED("Dokončeno"),
    CANCELLED("Zrušeno");

    private final String label;
}
