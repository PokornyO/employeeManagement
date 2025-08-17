package upce.backend.dto.comment;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
public class CommentRequest {
    private String text;
    private Long taskId;
    private Long userId;
}
