package upce.backend.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import upce.backend.dto.comment.CommentRequest;
import upce.backend.entity.AppUser;
import upce.backend.entity.Comment;
import upce.backend.entity.Task;
import upce.backend.exception.ResourceNotFoundException;
import upce.backend.mapper.CommentMapper;
import upce.backend.repository.CommentRepository;

@Service
@AllArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final AppUserService appUserService;
    private final TaskService taskService;
    private final CommentMapper commentMapper;

    public Page<Comment> findAll(Pageable pageable) {
        return commentRepository.findAll(pageable);
    }

    public Comment findById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
    }

    public Page<Comment> findByTaskId(Long taskId, Pageable pageable) {
        return commentRepository.findByTaskId(taskId, pageable);
    }

    public Page<Comment> findByUserId(Long userId, Pageable pageable) {
        return commentRepository.findByUserId(userId, pageable);
    }

    @Transactional
    public Comment create(CommentRequest commentRequest) {
        AppUser user = appUserService.findById(commentRequest.getUserId());
        Task task = taskService.findById(commentRequest.getTaskId());
        Comment comment = commentMapper.toEntity(commentRequest, task, user);
        return commentRepository.save(comment);
    }

    @Transactional
    public Comment update(Long id, CommentRequest commentRequest) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        AppUser user = appUserService.findById(commentRequest.getUserId());
        Task task = taskService.findById(commentRequest.getTaskId());
        commentMapper.setCommentFields(commentRequest, comment, task, user);
        return commentRepository.save(comment);
    }

    @Transactional
    public void delete(Long id) {
        commentRepository.deleteById(id);
    }
}
