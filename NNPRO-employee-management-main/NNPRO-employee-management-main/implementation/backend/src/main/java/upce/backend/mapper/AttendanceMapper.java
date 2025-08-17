package upce.backend.mapper;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import upce.backend.dto.attendance.AttendanceRequest;
import upce.backend.dto.attendance.AttendanceResponse;
import upce.backend.entity.AppUser;
import upce.backend.entity.Attendance;
import upce.backend.entity.Task;

@Component
@AllArgsConstructor
public class AttendanceMapper {

    private final AppUserMapper appUserMapper;

    public Attendance toEntity(AttendanceRequest attendanceRequest, Task task, AppUser appUser) {
        Attendance attendance = new Attendance();
        setAttendanceFields(attendanceRequest, attendance, task, appUser);
        return attendance;
    }

    public void setAttendanceFields(AttendanceRequest attendanceRequest, Attendance attendance, Task task, AppUser appUser) {
        attendance.setStartTime(attendanceRequest.getStartTime());
        attendance.setEndTime(attendanceRequest.getEndTime());
        attendance.setWorkDescription(attendanceRequest.getWorkDescription());
        attendance.setTask(task);
        attendance.setUser(appUser);

    }

    public void setAttendanceFields(AttendanceRequest attendanceRequest, Attendance attendance) {
        attendance.setStartTime(attendanceRequest.getStartTime());
        attendance.setEndTime(attendanceRequest.getEndTime());
        attendance.setWorkDescription(attendanceRequest.getWorkDescription());
    }

    public AttendanceResponse toDto(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .startTime(attendance.getStartTime())
                .endTime(attendance.getEndTime())
                .workDescription(attendance.getWorkDescription())
                .taskId(attendance.getTask().getId())
                .appUser(appUserMapper.toDto(attendance.getUser()))
                .build();
    }
}
