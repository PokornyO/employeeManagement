package upce.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import upce.backend.dto.attendance.AttendanceRequest;
import upce.backend.dto.attendance.AttendanceResponse;
import upce.backend.entity.Attendance;
import upce.backend.mapper.AttendanceMapper;
import upce.backend.service.AttendanceService;

@RestController
@RequestMapping("/attendances")
@AllArgsConstructor
@Tag(name = "Attendances", description = "Operations related to managing appusers attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final AttendanceMapper attendanceMapper;

    @Operation(summary = "Get all attendances", description = "Fetches all attendance records with pagination")
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<AttendanceResponse>> findAllAttendances(Pageable pageable) {
        Page<Attendance> attendances = attendanceService.findAllAttendances(pageable);
        Page<AttendanceResponse> attendanceResponses = attendances.map(attendanceMapper::toDto);
        return ResponseEntity.ok(attendanceResponses);
    }

    @Operation(summary = "Get attendance by task ID", description = "Fetches attendance records for a specific task with pagination")
    @GetMapping("/tasks/{taskId}")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<Page<AttendanceResponse>> findAttendanceByTaskId(@PathVariable Long taskId, Pageable pageable) {
        Page<Attendance> attendances = attendanceService.findByTaskId(taskId, pageable);
        Page<AttendanceResponse> attendanceResponses = attendances.map(attendanceMapper::toDto);
        return ResponseEntity.ok(attendanceResponses);
    }

    @Operation(summary = "Create attendance", description = "Creates a new attendance record")
    @PostMapping
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<AttendanceResponse> create(@RequestBody @Validated AttendanceRequest attendanceRequest) {
        Attendance attendance = attendanceService.create(attendanceRequest);
        return new ResponseEntity<>(attendanceMapper.toDto(attendance), HttpStatus.CREATED);
    }

    @Operation(summary = "Update attendance", description = "Updates an existing attendance record")
    @PutMapping("/{attendanceId}")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<AttendanceResponse> update(
            @PathVariable Long attendanceId,
            @RequestBody @Valid AttendanceRequest attendanceRequest) {
        Attendance updatedAttendance = attendanceService.update(attendanceId, attendanceRequest);
        return ResponseEntity.ok(attendanceMapper.toDto(updatedAttendance));
    }

    @Operation(summary = "Delete attendance", description = "Deletes an attendance record by its ID")
    @DeleteMapping("/{attendanceId}")
    @PreAuthorize("hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<Void> delete(@PathVariable Long attendanceId) {
        attendanceService.delete(attendanceId);
        return ResponseEntity.noContent().build();
    }
}
