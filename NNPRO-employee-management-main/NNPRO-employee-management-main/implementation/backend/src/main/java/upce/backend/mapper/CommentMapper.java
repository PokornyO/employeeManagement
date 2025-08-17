package upce.backend.mapper;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import upce.backend.dto.attendance.AttendanceRequest;
import upce.backend.dto.comment.CommentRequest;
import upce.backend.dto.comment.CommentResponse;
import upce.backend.entity.AppUser;
import upce.backend.entity.Attendance;
import upce.backend.entity.Comment;
import upce.backend.entity.Task;

@Component
@AllArgsConstructor
public class CommentMapper {
    private final TaskMapper taskMapper;
    private final AppUserMapper appUserMapper;

    public Comment toEntity(CommentRequest commentRequest, Task task, AppUser appUser) {
        Comment comment = new Comment();
        setCommentFields(commentRequest, comment, task, appUser);
        return comment;
    }
    public void setCommentFields(CommentRequest commentRequest, Comment comment, Task task, AppUser appUser) {
        comment.setText(commentRequest.getText());
        comment.setTask(task);
        comment.setUser(appUser);
    }
    public CommentResponse toDto(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .text(comment.getText())
                .createdDate(comment.getCreatedDate())
                .task(taskMapper.toDto(comment.getTask()))
                .appUser(appUserMapper.toDto(comment.getUser()))
                .build();
    }
}
