import locale from "../locale/cs.json";
import axiosPrivate from "../api/axiosPrivate.ts";
import {StatusCodes} from "http-status-codes";
import {AxiosError} from "axios";
import {Comment, CommentResponse, CommentsResponse} from "../types/comment.ts";

export const getAllTasksComments = async (taskId: number, page: number, size: number): Promise<CommentsResponse> => {
    let message = locale.ERROR_LOADING_COMMENTS;
    try {
        const response = await axiosPrivate.get(`/tasks/${taskId}/comments`, {
            params: {
                page: page,
                size: size,
            },
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                comments: response.data.content,
                pagination: {
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    pageNumber: response.data.pageable.pageNumber,
                    pageSize: response.data.pageable.pageSize,
                    isFirst: response.data.first,
                    isLast: response.data.last,
                },
            };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.COMMENTS_NOT_FOUND;
            }
        }
    }
    return { success: false, message: message };
};

export const createComment = async (comment: Comment): Promise<CommentResponse> => {
    let message = locale.ERROR_CREATING_COMMENT;
    try {
        const response = await axiosPrivate.post('/comments', {
            text: comment.text,
            taskId: comment.task.id,
            userId: comment.appUser.id,
        });

        if (response.status === StatusCodes.CREATED) {
            return { success: true, comment: response.data };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            }
        }
    }
    return { success: false, message: message };
};

export const deleteComment = async (commentId: number): Promise<CommentResponse> => {
    let message = locale.ERROR_DELETE_COMMENT;

    try {
        const response = await axiosPrivate.delete(`/comments/${commentId}`);
        if (response.status === StatusCodes.NO_CONTENT) {
            return { success: true };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.COMMENTS_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};

export const updateComment = async (comment: Comment): Promise<CommentResponse> => {
    let message = locale.ERROR_UPDATE_COMMENT;

    try {
        const response = await axiosPrivate.put(`/comments/${comment.id}`, {
            text: comment.text,
            taskId: comment.task.id,
            userId: comment.appUser.id,
        });
        if (response.status === StatusCodes.OK) {
            return { success: true };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.COMMENTS_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};