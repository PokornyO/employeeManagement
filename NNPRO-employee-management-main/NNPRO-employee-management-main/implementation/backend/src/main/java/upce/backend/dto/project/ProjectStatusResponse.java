package upce.backend.dto.project;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectStatusResponse {

    private String name;

    private String label;

}
