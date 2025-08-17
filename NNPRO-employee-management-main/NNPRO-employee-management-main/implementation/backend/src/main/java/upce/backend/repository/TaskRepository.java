package upce.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import upce.backend.entity.AppUser;
import upce.backend.entity.Task;
import upce.backend.enums.TaskDifficulty;
import upce.backend.enums.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId")
    Page<Task> findByProjectId(Long projectId, Pageable pageable);

    Page<Task> findByProjectIdAndDueDateBetween(Long projectId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    Page<Task> findByProjectIdAndDueDateAfter(Long projectId, LocalDateTime startDate, Pageable pageable);

    Page<Task> findByProjectIdAndDueDateBefore(Long projectId, LocalDateTime endDate, Pageable pageable);

    @Query("SELECT t FROM Task t JOIN t.appUsers u WHERE u.id = :userId")
    Page<Task> findByAppUserId(Long userId, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.difficulty = :difficulty AND t.finishDate IS NOT NULL")
    List<Task> findCompletedTasksByDifficulty(TaskDifficulty difficulty);

    int countByProjectId(Long projectId);

    int countByProjectIdAndStatus(Long projectId, TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId " +
            "AND t.status= 'COMPLETED' AND t.dueDate > t.finishDate")
    int countByProjectIdAndCompletedOnTime(Long projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId " +
            "AND t.status= 'COMPLETED' AND t.dueDate < t.finishDate")
    int countByProjectIdAndCompletedLate(Long projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId and :appUser MEMBER OF t.appUsers")
    int countByProjectIdAndAppUserId(Long projectId, AppUser appUser);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND :appUser MEMBER OF t.appUsers AND  t.status = :status")
    int countByProjectIdAndAppUserIdAndStatus(Long projectId, AppUser appUser, TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND :appUser MEMBER OF t.appUsers AND t.dueDate > t.finishDate")
    int countByProjectIdAndAppUserIdAndCompletedOnTime(Long projectId, AppUser appUser);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId AND t.finishDate BETWEEN :startDate AND :endDate AND t.status='COMPLETED'")
    List<Task> findByProjectIdAndCompletionDateBetween(Long projectId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT t FROM Task t JOIN t.appUsers a WHERE t. project.id = :projectId AND t.finishDate BETWEEN :startDate AND :endDate " +
            "AND t.status='COMPLETED' AND a.id = :userId")
    List<Task> findByProjectIdAndUserIdAndCompletionDateBetween(Long projectId, Long userId, LocalDateTime startDate, LocalDateTime endDate);




}
