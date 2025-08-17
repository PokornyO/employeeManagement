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
import org.springframework.web.bind.annotation.*;
import upce.backend.dto.comment.CommentRequest;
import upce.backend.dto.comment.CommentResponse;
import upce.backend.entity.Comment;
import upce.backend.mapper.CommentMapper;
import upce.backend.service.CommentService;

@RestController
@AllArgsConstructor
@Tag(name = "Comments", description = "Endpoints for managing comments")
public class CommentController {

    private final CommentService commentService;
    private final CommentMapper commentMapper;

    @Operation(summary = "Get all comments", description = "Fetches all comment records with pagination")
    @GetMapping("/comments")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<CommentResponse>> findAll(Pageable pageable) {
        Page<Comment> comments = commentService.findAll(pageable);
        return ResponseEntity.ok(comments.map(commentMapper::toDto));
    }

    @Operation(summary = "Get comments by task ID", description = "Fetches all comment records for specific task with pagination")
    @GetMapping("/tasks/{taskId}/comments")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOrMemberOfProjectByTaskId(#taskId)")
    public ResponseEntity<Page<CommentResponse>> findCommentsByTaskId(@PathVariable Long taskId, Pageable pageable) {
        Page<Comment> comments = commentService.findByTaskId(taskId, pageable);
        return ResponseEntity.ok(comments.map(commentMapper::toDto));
    }

    @Operation(summary = "Get comment by ID", description = "Returns specific comment")
    @GetMapping("comments/{id}")
    public ResponseEntity<CommentResponse> getCommentById(@PathVariable Long id) {
        Comment comment = commentService.findById(id);
        return ResponseEntity.ok(commentMapper.toDto(comment));
    }

    @Operation(summary = "Get comments by user ID", description = "Fetches all comment records for specific user with pagination")
    @GetMapping("/appUsers/{userId}/comments")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isUser(#userId)")
    public ResponseEntity<Page<CommentResponse>> findCommentsByUserId(@PathVariable Long userId, Pageable pageable) {
        Page<Comment> comments = commentService.findByUserId(userId, pageable);
        return ResponseEntity.ok(comments.map(commentMapper::toDto));
    }

    @Operation(summary = "Create comment", description = "Creates a new comment for a specific task.")
    @PostMapping("/comments")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isLeaderOrMemberOfProjectByTaskId(#commentRequest.taskId)")
    public ResponseEntity<CommentResponse> create(@RequestBody @Valid CommentRequest commentRequest) {
        Comment createdComment = commentService.create(commentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentMapper.toDto(createdComment));
    }

    @Operation(summary = "Update comment", description = "Updates an existing comment by its ID.")
    @PutMapping("/comments/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isUserInComment(#id)")
    public ResponseEntity<CommentResponse> update(@PathVariable Long id, @RequestBody @Valid CommentRequest commentRequest) {
        Comment updatedComment = commentService.update(id, commentRequest);
        return ResponseEntity.ok(commentMapper.toDto(updatedComment));
    }

    @Operation(summary = "Delete comment", description = "Deletes a specific comment by its ID.")
    @DeleteMapping("/comments/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @authService.isUserInComment(#id)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
