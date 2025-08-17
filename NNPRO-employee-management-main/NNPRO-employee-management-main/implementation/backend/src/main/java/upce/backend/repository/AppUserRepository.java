package upce.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import upce.backend.entity.AppUser;

import java.util.List;
import java.util.Optional;


@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    @Query("SELECT u FROM AppUser u")
    Page<AppUser> findAllAppUsers(Pageable pageable);

    @Query("SELECT u FROM AppUser u JOIN u.role r where r.name = 'ROLE_EMPLOYEE'")
    Page<AppUser> findAllEmployees(Pageable pageable);

    @Query("SELECT u FROM AppUser u JOIN u.appuserProjects p WHERE p.id = :projectId")
    Page<AppUser> findAllUsersByProjectId(Pageable pageable, Long projectId);

    @Query("SELECT u FROM AppUser u JOIN u.appuserProjects p WHERE p.id = :projectId")
    List<AppUser> findAllUsersByProjectId(Long projectId);

    @Query("SELECT u FROM AppUser u JOIN u.tasks t WHERE t.id = :taskId")
    Page<AppUser> findAllUsersByTaskId(Pageable pageable, Long taskId);

    @Query("SELECT u FROM AppUser u JOIN u.tasks t WHERE t.id = :taskId")
    List<AppUser> findAllUsersByTaskId(Long taskId);

    AppUser findByUsername(String username);

    @Query("SELECT u FROM AppUser u WHERE u.firstName LIKE %:inputString% " +
            "OR u.surname LIKE %:inputString% " +
            "OR u.username LIKE %:inputString% " +
            "OR u.email LIKE %:inputString%")
    Page<AppUser> findAppUserByInputString(Pageable pageable, String inputString);

    boolean existsByUsername(String username);

    boolean existsByEmail(String username);

    @Query("SELECT COUNT(u) FROM AppUser u JOIN u.appuserProjects p WHERE p.id = :projectId")
    int countByProjectId(Long projectId);
}
