package upce.backend.mapper;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import upce.backend.dto.performanceReport.PerformanceReportRequest;
import upce.backend.dto.performanceReport.PerformanceReportResponse;
import upce.backend.entity.AppUser;
import upce.backend.entity.PerformanceReport;
import upce.backend.entity.Task;

@Component
@AllArgsConstructor
public class PerformanceReportMapper {
    private final AppUserMapper appUserMapper;

    public PerformanceReport toEntity(PerformanceReportRequest performanceReportRequest, AppUser user, Task task) {
        PerformanceReport performanceReport = new PerformanceReport();
        setPerformanceReportFields(performanceReportRequest, performanceReport, user, task);
        return performanceReport;
    }

    public void setPerformanceReportFields(PerformanceReportRequest reportRequest, PerformanceReport performanceReport,
                                           AppUser user, Task task) {
        performanceReport.setOverallRating(reportRequest.getOverallRating());
        performanceReport.setFeedback(reportRequest.getFeedback());
        performanceReport.setAppUser(user);
        performanceReport.setTask(task);
    }
    public PerformanceReportResponse toDto(PerformanceReport performanceReport) {
        return PerformanceReportResponse.builder()
                .id(performanceReport.getId())
                .appUser(appUserMapper.toDto(performanceReport.getAppUser()))
                .taskId(performanceReport.getTask().getId())
                .overallRating(performanceReport.getOverallRating())
                .reviewDate(performanceReport.getReviewDate())
                .feedback(performanceReport.getFeedback())
                .build();
    }
}
