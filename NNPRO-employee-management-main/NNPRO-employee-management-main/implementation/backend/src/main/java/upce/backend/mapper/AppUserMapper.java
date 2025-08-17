package upce.backend.mapper;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import upce.backend.dto.appUser.AppUserRequest;
import upce.backend.dto.appUser.AppUserResponse;
import upce.backend.entity.AppUser;
import upce.backend.entity.Role;
import upce.backend.service.RoleService;

@Component
@AllArgsConstructor
public class AppUserMapper {
    private final RoleService roleService;

    public AppUser toEntity(AppUserRequest appUserRequest) {
        AppUser appUser = new AppUser();
        setAppUserFields(appUserRequest, appUser);
        return appUser;
    }

    public void setAppUserFields(AppUserRequest appUserRequest, AppUser appUser) {
        appUser.setEmail(appUserRequest.getEmail());
        appUser.setUsername(appUserRequest.getUsername());
        appUser.setFirstName(appUserRequest.getFirstName());
        appUser.setSurname(appUserRequest.getSurname());
        appUser.setPhoneNumber(appUserRequest.getPhoneNumber());

        Role role = roleService.findByName(appUserRequest.getRole());
        appUser.setRole(role);

        appUser.setPassword(appUserRequest.getPassword());
    }

    public AppUserResponse toDto(AppUser appUser) {
        if(appUser == null){
            return null;
        }
        return AppUserResponse.builder()
                .id(appUser.getId())
                .firstName(appUser.getFirstName())
                .surname(appUser.getSurname())
                .phoneNumber(appUser.getPhoneNumber())
                .username(appUser.getUsername())
                .email(appUser.getEmail())
                .role(appUser.getRole().getName())
                .build();
    }
}
