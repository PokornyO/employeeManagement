package upce.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import upce.backend.enums.TaskDifficulty;
import upce.backend.enums.TaskStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @CreationTimestamp
    private LocalDateTime creationDate;

    private LocalDateTime dueDate;

    private LocalDateTime expectedFinishDate;

    private LocalDateTime finishDate;

    @Enumerated(EnumType.STRING)
    private TaskDifficulty difficulty;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @ManyToMany(mappedBy = "tasks")
    private List<AppUser> appUsers = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Attendance> attendances = new ArrayList<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PerformanceReport> performances = new ArrayList<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @PreRemove
    private void removeTaskFromUsers() {
        for (AppUser user : appUsers) {
            user.getTasks().remove(this);
        }
    }
}