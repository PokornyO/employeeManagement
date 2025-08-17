package upce.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import upce.backend.entity.Project;
import upce.backend.enums.ProjectStatus;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT p FROM Project p")
    Page<Project> findAllProjects(Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.leader.id = :appUserId")
    Page<Project> findLeaderProjectsByAppUserId(Long appUserId, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Project p " +
            "JOIN p.tasks t " +
            "JOIN t.appUsers u " +
            "WHERE u.id = :appUserId ")
    Page<Project> findByAppUserIdInTasks(Long appUserId, Pageable pageable);

    @Query("SELECT p FROM Project p LEFT JOIN p.appUsers u WHERE u.id = :appUserId OR p.leader.id = :appUserId")
    Page<Project> findAppUserProjects(Long appUserId, Pageable pageable);

    int countByStatus(ProjectStatus status);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = 'COMPLETED' AND p.dueDate > p.finishDate")
    int countByStatusAndCompletedOnTime();

    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = 'COMPLETED' AND p.dueDate < p.finishDate")
    int countByStatusAndCompletedLate();
}
