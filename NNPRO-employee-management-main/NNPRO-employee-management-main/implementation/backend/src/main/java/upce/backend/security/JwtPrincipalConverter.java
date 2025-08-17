package upce.backend.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.AllArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import upce.backend.entity.AppUser;
import upce.backend.entity.Role;
import upce.backend.service.AppUserService;
import upce.backend.service.RoleService;

import java.util.List;

@AllArgsConstructor
@Component
public class JwtPrincipalConverter {

    private final AppUserService appUserService;

    private final RoleService roleService;

    public UserPrincipal convert(DecodedJWT jwt) {

        long userId = Long.parseLong(jwt.getSubject());
        AppUser appUser = appUserService.findById(userId);
        Role role = roleService.findByAppUsers(appUser);

        SimpleGrantedAuthority userRole = new SimpleGrantedAuthority(role.getName());

        return UserPrincipal.builder()
                .userId(userId)
                .username(appUser.getUsername())
                .firstName(appUser.getFirstName())
                .phoneNumber(appUser.getPhoneNumber())
                .email(appUser.getEmail())
                .authorities(List.of(userRole))
                .surname(appUser.getSurname())
                .build();


    }
}
