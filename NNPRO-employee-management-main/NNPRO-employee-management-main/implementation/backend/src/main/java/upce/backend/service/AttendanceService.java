package upce.backend.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import upce.backend.dto.attendance.AttendanceRequest;
import upce.backend.entity.AppUser;
import upce.backend.entity.Attendance;
import upce.backend.entity.Task;
import upce.backend.exception.ResourceNotFoundException;
import upce.backend.mapper.AttendanceMapper;
import upce.backend.repository.AttendanceRepository;


@Service
@AllArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final TaskService taskService;
    private final AppUserService appUserService;
    private final AttendanceMapper attendanceMapper;

    public Page<Attendance> findAllAttendances(Pageable pageable) {
        return attendanceRepository.findAllAttendances(pageable);
    }

    @Transactional
    public Attendance create(AttendanceRequest attendanceRequest) {
        Task task = taskService.findById(attendanceRequest.getTaskId());
        AppUser appUser = appUserService.findById(attendanceRequest.getAppUserId());
        return attendanceRepository.save(attendanceMapper.toEntity(attendanceRequest, task, appUser));
    }
    public Page<Attendance> findByTaskId(Long taskId, Pageable pageable) {
        return attendanceRepository.findByTaskId(taskId, pageable);
    }

    @Transactional
    public Attendance update(Long id, AttendanceRequest attendanceRequest) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found"));
        if(attendanceRequest.getTaskId() != null && attendanceRequest.getAppUserId() != null) {
            Task task = taskService.findById(attendanceRequest.getTaskId());
            AppUser appUser = appUserService.findById(attendanceRequest.getAppUserId());
            attendanceMapper.setAttendanceFields(attendanceRequest, attendance, task, appUser);
        } else {
            attendanceMapper.setAttendanceFields(attendanceRequest, attendance);
        }
        return attendanceRepository.save(attendance);
    }

    @Transactional
    public void delete(Long id) {
        attendanceRepository.deleteById(id);
    }
}
