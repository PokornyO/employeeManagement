package upce.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import upce.backend.entity.AppUser;
import upce.backend.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findByName(String roleName);

    Role findByAppUsers(AppUser appUser);

    boolean existsByName(String name);
}
