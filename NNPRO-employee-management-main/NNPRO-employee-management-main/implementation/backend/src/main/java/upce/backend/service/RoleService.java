package upce.backend.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import upce.backend.entity.AppUser;
import upce.backend.entity.Role;
import upce.backend.repository.RoleRepository;

@AllArgsConstructor
@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public Role findByName(String roleName) {
        return roleRepository.findByName(roleName);
    }

    public Role findByAppUsers(AppUser appUser) {
        return roleRepository.findByAppUsers(appUser);
    }

    public boolean existsByName(String roleName) {
        return roleRepository.existsByName(roleName);
    }

    @Transactional
    public void create(Role role) {
        roleRepository.save(role);
    }
}

