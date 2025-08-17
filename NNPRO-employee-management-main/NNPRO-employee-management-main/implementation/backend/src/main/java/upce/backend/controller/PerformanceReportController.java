package upce.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import upce.backend.dto.performanceReport.PerformanceReportRequest;
import upce.backend.dto.performanceReport.PerformanceReportResponse;
import upce.backend.entity.PerformanceReport;
import upce.backend.mapper.PerformanceReportMapper;
import upce.backend.service.PerformanceReportService;

@RestController
@AllArgsConstructor
@Tag(name = "Performance Report", description = "Operations related to performance reports")
public class PerformanceReportController {

    private final PerformanceReportService performanceReportService;
    private final PerformanceReportMapper performanceReportMapper;

    @Operation(summary = "Get all performance reports", description = "Fetches all performance reports with pagination")
    @GetMapping("/performance-reports")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<PerformanceReportResponse>> findAll(Pageable pageable) {
        return ResponseEntity.ok(performanceReportService.findAll(pageable).map(performanceReportMapper::toDto));
    }

    @Operation(summary = "Get performance reports by task ID", description = "Fetches performance reports by task ID with pagination")
    @GetMapping("/tasks/{taskId}/performance-reports")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOrMemberOfProjectByTaskId(#taskId)")
    public ResponseEntity<Page<PerformanceReportResponse>> findPerformanceReportsByTaskId(@PathVariable Long taskId, Pageable pageable) {
        Page<PerformanceReport> performanceReports = performanceReportService.findByTaskId(taskId, pageable);
        return ResponseEntity.ok(performanceReports.map(performanceReportMapper::toDto));
    }

    @Operation(summary = "Get performance reports by user ID", description = "Fetches performance reports by user ID with pagination")
    @GetMapping("/appUsers/{userId}/performance-reports")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isUserInPerformanceReport(#userId)")
    public ResponseEntity<Page<PerformanceReportResponse>> findPerformanceReportsByUserId(@PathVariable Long userId, Pageable pageable) {
        Page<PerformanceReport> performanceReports = performanceReportService.findByUserId(userId, pageable);
        return ResponseEntity.ok(performanceReports.map(performanceReportMapper::toDto));
    }

    @Operation(summary = "Create performance report", description = "Creates a new performance report")
    @PostMapping("/performance-reports")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOrMemberOfProjectByTaskId(#request.taskId)")
    public ResponseEntity<PerformanceReportResponse> create(@RequestBody PerformanceReportRequest request) {
        PerformanceReport createdReport = performanceReportService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(performanceReportMapper.toDto(createdReport));
    }

    @Operation(summary = "Update performance report", description = "Updates performance report by its ID")
    @PutMapping("/performance-reports/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOrMemberOfProjectByTaskId(#request.taskId)")
    public ResponseEntity<PerformanceReportResponse> update(
            @PathVariable Long id,
            @RequestBody PerformanceReportRequest request) {
        PerformanceReport updatedReport = performanceReportService.update(id, request);
        return ResponseEntity.ok(performanceReportMapper.toDto(updatedReport));
    }

    @Operation(summary = "Delete performance report", description = "Deletes performance report by its ID")
    @DeleteMapping("/performance-reports/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOfProjectByTaskId(#id)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        performanceReportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}