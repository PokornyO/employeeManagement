import {Comment, CommentResponse} from "../../types/comment.ts";
import React, {useState} from "react";
import {useAuth} from "../providers/AuthProvider.tsx";
import {useTheme} from "styled-components";
import locale from "../../locale/cs.json";
import {Box, Divider, IconButton, ListItem, Typography} from "@mui/material";
import {AccessTime, Delete, Edit} from "@mui/icons-material";
import {Role} from "../../types/role.ts";
import PaginatedList from "../pagination/PaginatedList.tsx";
import ModalDialog from "../dialog/ModalDialog.tsx";
import ConfirmationDialog from "../dialog/ConfirmationDialog.tsx";
import CommentForm from "../forms/CommentForm.tsx";

interface CommentListProps {
    fetchComment: (page: number, size: number) => Promise<{items: Comment[]; totalPages: number;}>;
    onUpdate: (comment: Comment) => Promise<CommentResponse>;
    onDelete: (commentId: number) => void;
    refreshKey: number;
}

const CommentList: React.FC<CommentListProps> = ({fetchComment, onUpdate, onDelete, refreshKey,}) => {

    const { hasAccess } = useAuth();
    const theme = useTheme();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    const [editError, setEditError] = useState<string | null>(null);

    const handleEditClick = (comment: Comment) => {
        setSelectedComment(comment);
        setEditError(null);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (comment: Comment) => {
        setSelectedComment(comment);
        setIsDeleteDialogOpen(true);
    };

    const handleEditSubmit = async (updatedComment: Comment) => {
        const response = await onUpdate(updatedComment);
        if (response.success) {
            setIsEditDialogOpen(false);
        } else {
            setEditError(response.message ?? locale.ERROR_UPDATE_COMMENT);
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedComment) {
            onDelete(selectedComment.id);
        }
        setIsDeleteDialogOpen(false);
    };
    const renderCommentItem = (comment: Comment) => (
        <Box key={comment.id}>
            <ListItem
                sx={{
                    display: "flex",
                    alignItems: "center",
                    paddingY: 2,
                    gap: 5,
                    justifyContent: "space-between",
                    backgroundColor: theme.secondary,
                    color: theme.text,
                    "&:hover": {
                        backgroundColor: theme.primaryLight,
                    },
                }}
            >
                <Typography variant="body1">{comment.appUser.username}</Typography>
                <Typography variant="body1">{comment.text}</Typography>
                <Box sx={{ display: "flex", color: "gray", alignItems: "center", gap: 1, marginTop: 0.5 }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body2">
                        {new Date(comment.createdDate).toLocaleString("cs-CZ", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Typography>
                </Box>

                {(hasAccess(Role.EMPLOYEE)) && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => handleEditClick(comment)}>
                            <Edit sx={{ color: theme.text }} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(comment)}>
                            <Delete sx={{ color: theme.text }} />
                        </IconButton>
                    </Box>
                )}
            </ListItem>
            <Divider />
        </Box>
    );

    return (
        <>
            <ListItem
                sx={{
                    display: "flex",
                    alignItems: "center",
                    paddingY: 2,
                    gap: 5,
                    justifyContent: "space-between",
                    backgroundColor: theme.secondary,
                    color: theme.text,
                }}
            >
                <Typography variant="body1" sx={{ flex: 0.6 }}>
                    {locale.USER}
                </Typography>
                <Typography variant="body1" sx={{ flex: 0.7 }}>
                    {locale.COMMENT_TEXT}
                </Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {locale.CREATION_DATE}
                </Typography>
            </ListItem>

            <PaginatedList
                fetchData={fetchComment}
                renderItem={renderCommentItem}
                pageSize={20}
                refreshKey={refreshKey}
            />
            <ModalDialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                title={locale.EDIT_COMMENT}
            >
                {selectedComment && (
                    <CommentForm
                        initialValues={{
                            id: selectedComment.id,
                            text: selectedComment.text,
                        }}
                        onSubmit={handleEditSubmit}
                        submitButtonText={locale.SAVE_CHANGES}
                        error={editError}
                    />
                )}
            </ModalDialog>

            <ConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={locale.DELETE_CONFIRMATION}
                message={`${locale.DELETE_COMMENT_CONFIRMATION} ?`}
                confirmButtonText={locale.DELETE}
                cancelButtonText={locale.CANCEL}
            />
        </>
    );
};

export default CommentList;