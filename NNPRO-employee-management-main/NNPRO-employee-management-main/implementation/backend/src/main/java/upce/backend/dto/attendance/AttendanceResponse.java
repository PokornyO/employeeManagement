package upce.backend.dto.attendance;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;
import upce.backend.dto.appUser.AppUserResponse;
import upce.backend.entity.Task;

import java.time.LocalDateTime;

@Getter
@Builder
public class AttendanceResponse {
    private Long id;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String workDescription;

    private Long taskId;

    private AppUserResponse appUser;
}
