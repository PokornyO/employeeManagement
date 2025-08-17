package upce.backend.security;


import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import upce.backend.entity.AppUser;
import upce.backend.service.AppUserService;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CustomAppUserDetailService implements UserDetailsService {

    private final AppUserService appUserService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = appUserService.findByUsername(username);

        SimpleGrantedAuthority userRole = new SimpleGrantedAuthority(user.getRole().getName());

        return UserPrincipal.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .surname(user.getSurname())
                .phoneNumber(user.getPhoneNumber())
                .authorities(List.of(userRole))
                .password(user.getPassword())
                .build();
    }
}
