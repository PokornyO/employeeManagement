package upce.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import upce.backend.entity.PerformanceReport;

@Repository
public interface PerformanceReportRepository extends JpaRepository<PerformanceReport,Long> {

    @Query("SELECT p FROM PerformanceReport p")
    Page<PerformanceReport> findAllPerformanceReports(Pageable pageable);
    @Query("SELECT pr FROM PerformanceReport pr WHERE pr.task.id = :taskId")
    Page<PerformanceReport> findByTaskId(Long taskId, Pageable pageable);

    @Query("SELECT pr FROM PerformanceReport pr WHERE pr.appUser.id = :userId")
    Page<PerformanceReport> findByUserId(Long userId, Pageable pageable);
}
