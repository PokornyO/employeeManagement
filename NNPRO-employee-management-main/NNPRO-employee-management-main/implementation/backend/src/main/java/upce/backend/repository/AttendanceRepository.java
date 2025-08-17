package upce.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import upce.backend.entity.AppUser;
import upce.backend.entity.Attendance;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    @Query("SELECT a FROM Attendance a")
    Page<Attendance> findAllAttendances(Pageable pageable);

    @Query("SELECT a FROM Attendance a WHERE a.task.id = :taskId")
    Page<Attendance> findByTaskId(Long taskId, Pageable pageable);

    @Query("SELECT a FROM Attendance a WHERE a.task.project.id = :projectId AND a.startTime BETWEEN :startDate AND :endDate")
    List<Attendance> findByProjectIdAndStartTimeBetween(Long projectId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT a FROM Attendance a WHERE a.task.project.id = :projectId AND a.user.id = :userId AND a.startTime BETWEEN :startDate AND :endDate")
    List<Attendance> findByProjectIdAndUserIdAndStartTimeBetween(Long projectId, Long userId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT a FROM Attendance a WHERE a.task.project.id = :projectId")
    List<Attendance> findByProjectId(Long projectId);

    @Query("SELECT a FROM Attendance a WHERE a.task.project.id = :projectId AND a.user.id = :userId")
    List<Attendance> findByProjectIdAndUserId(Long projectId, Long userId);
}
