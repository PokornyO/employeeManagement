package upce.backend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TaskStatus {
    TODO("Čeká na zpracování"),
    IN_PROGRESS("Probíhá"),
    REVIEW("Kontrola"),
    COMPLETED("Dokončeno");

    private final String label;
}