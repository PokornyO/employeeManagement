package upce.backend.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import upce.backend.dto.performanceReport.PerformanceReportRequest;
import upce.backend.entity.AppUser;
import upce.backend.entity.PerformanceReport;
import upce.backend.entity.Task;
import upce.backend.enums.TaskStatus;
import upce.backend.exception.BadRequestException;
import upce.backend.exception.ResourceNotFoundException;
import upce.backend.mapper.PerformanceReportMapper;
import upce.backend.repository.PerformanceReportRepository;

@Service
@AllArgsConstructor
public class PerformanceReportService {

    private final PerformanceReportRepository performanceReportRepository;
    private final AppUserService appUserService;
    private final TaskService taskService;
    private final PerformanceReportMapper reportMapper;

    public Page<PerformanceReport> findAll(Pageable pageable) {
        return performanceReportRepository.findAllPerformanceReports(pageable);
    }
    public PerformanceReport findById(Long id) {
        return performanceReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance Report not found"));
    }

    public Page<PerformanceReport> findByTaskId(Long taskId, Pageable pageable) {
        return performanceReportRepository.findByTaskId(taskId, pageable);
    }

    public Page<PerformanceReport> findByUserId(Long userId, Pageable pageable) {
        return performanceReportRepository.findByUserId(userId, pageable);
    }

    @Transactional
    public PerformanceReport create(PerformanceReportRequest performanceReportRequest) {
        AppUser user = appUserService.findById(performanceReportRequest.getUserId());
        Task task = taskService.findById(performanceReportRequest.getTaskId());
        if (!task.getStatus().equals(TaskStatus.COMPLETED)) {
            throw new BadRequestException("Performance Report can only be created for tasks with status 'completed'.");
        }
        return performanceReportRepository.save(reportMapper.toEntity(performanceReportRequest, user, task));
    }

    @Transactional
    public PerformanceReport update(Long id, PerformanceReportRequest performanceReportRequest) {
        PerformanceReport performanceReport = performanceReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance Report not found"));

        AppUser user = appUserService.findById(performanceReportRequest.getUserId());
        Task task = taskService.findById(performanceReportRequest.getTaskId());
        if (!task.getStatus().equals(TaskStatus.COMPLETED)) {
            throw new BadRequestException("Performance Report can only be created for tasks with status 'completed'.");
        }
        reportMapper.setPerformanceReportFields(performanceReportRequest, performanceReport, user, task);
        return performanceReportRepository.save(performanceReport);
    }

    @Transactional
    public void delete(Long id) {
        performanceReportRepository.deleteById(id);
    }
}
