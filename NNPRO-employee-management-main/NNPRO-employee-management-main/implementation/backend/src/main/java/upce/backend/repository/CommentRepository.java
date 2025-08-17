package upce.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import upce.backend.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c")
    Page<Comment> findAllPerformanceReports(Pageable pageable);
    @Query("SELECT c FROM Comment c WHERE c.task.id = :taskId")
    Page<Comment> findByTaskId(Long taskId, Pageable pageable);
    @Query("SELECT c FROM Comment c WHERE c.user.id = :userId")
    Page<Comment> findByUserId(Long userId, Pageable pageable);
}