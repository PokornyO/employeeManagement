import React, {useState} from "react";
import {useTask} from "../providers/TaskProvider.tsx";
import {toast} from "react-toastify";
import locale from "../../locale/cs.json";
import {Box} from "@mui/material";
import ModalDialog from "../dialog/ModalDialog.tsx";
import AddButton from "../button/AddButton.tsx";
import {createComment, deleteComment, getAllTasksComments, updateComment} from "../../services/commentService.ts";
import {Comment,CommentResponse} from "../../types/comment.ts";
import CommentList from "./CommentList.tsx";
import CommentForm from "../forms/CommentForm.tsx";

const CommentManagement: React.FC = () => {
    const { task } = useTask();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState<number>(0);

    const handleAddCommentClick = () => {
        setIsAddDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsAddDialogOpen(false);
        setAddError(null);
    };


    const handleCreateComment = async (commnent: Comment) => {
        const response = await createComment(commnent);

        if (response.success) {
            toast.success(locale.COMMENT_SUCCESSFULLY_CREATED);
            setIsAddDialogOpen(false);
            setRefreshKey((prev) => prev + 1);
        } else {
            setAddError(response.message ?? locale.ERROR_CREATING_COMMENT);
        }
    };

    const handleUpdateComment = async (updatedComment: Comment): Promise<CommentResponse> => {
        const response = await updateComment(updatedComment);
        if (response.success) {
            toast.success(locale.COMMENT_SUCCESSFULLY_UPDATED);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message ?? locale.ERROR_UPDATE_COMMENT);
        }
        return response;
    };

    const handleDeleteComment = async (commentId: number) => {
        const response = await deleteComment(commentId);

        if (response.success) {
            toast.success(locale.COMMENT_SUCCESSFULLY_DELETED);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message ?? locale.ERROR_DELETE_COMMENT);
        }
    };

    const fetchComments = async (page: number, size: number) => {
        const response = await getAllTasksComments(task!.id, page, size);
        if (response.success) {
            return {
                items: response.comments ?? [],
                totalPages: response.pagination?.totalPages ?? 0,
            };
        } else {
            toast.error(response.message ?? locale.ERROR_LOADING_COMMENTS);
            return { items: [], totalPages: 0 };
        }
    };

    return (
        <>
            <Box sx={{ marginBottom: 3 }}>
                <AddButton onClick={handleAddCommentClick} />
            </Box>

            <ModalDialog
                open={isAddDialogOpen}
                onClose={handleDialogClose}
                title={locale.NEW_COMMENT}
            >
                <CommentForm onSubmit={handleCreateComment} error={addError}/>
            </ModalDialog>

            <CommentList
                fetchComment={fetchComments}
                onUpdate={handleUpdateComment}
                onDelete={handleDeleteComment}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default CommentManagement;