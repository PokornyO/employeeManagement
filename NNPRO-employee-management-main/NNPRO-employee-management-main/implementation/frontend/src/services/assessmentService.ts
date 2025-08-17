import locale from "../locale/cs.json";
import axiosPrivate from "../api/axiosPrivate.ts";
import {StatusCodes} from "http-status-codes";
import {AxiosError} from "axios";
import {Assessment, AssessmentResponse, AssessmentsResponse} from "../types/assessment.ts";
import {toIsoDateTime} from "../utils/date.ts";

export const getAllTaskMembersAssessment = async (taskId: number, page: number, size: number): Promise<AssessmentsResponse> => {
    let message = locale.ERROR_LOADING_ASSESSMENTS;
    try {
        const response = await axiosPrivate.get(`/tasks/${taskId}/performance-reports`, {
            params: {
                page: page,
                size: size,
            },
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                assessments: response.data.content,
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
                message = locale.ASSESSMENTS_NOT_FOUND;
            }
        }
    }
    return { success: false, message: message };
};

export const createAssessment = async (assessment: Assessment): Promise<AssessmentResponse> => {
    let message = locale.ERROR_CREATING_ASSESSMENT;
    try {
        const response = await axiosPrivate.post('/performance-reports', {
            reviewDate: toIsoDateTime(assessment.reviewDate),
            overallRating: assessment.overallRating,
            feedback: assessment.feedback,
            taskId: assessment.task.id,
            userId: assessment.appUser.id,
        });

        if (response.status === StatusCodes.CREATED) {
            return { success: true, assessment: response.data };
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

export const deleteAssessment = async (assessmentId: number): Promise<AssessmentResponse> => {
    let message = locale.ERROR_DELETE_ASSESSMENT;

    try {
        const response = await axiosPrivate.delete(`/performance-reports/${assessmentId}`);
        if (response.status === StatusCodes.NO_CONTENT) {
            return { success: true };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.ASSESSMENTS_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};

export const updateAssessment = async (assessment: Assessment): Promise<AssessmentResponse> => {
    let message = locale.ERROR_UPDATE_ASSESSMENT;

    try {
        const response = await axiosPrivate.put(`/performance-reports/${assessment.id}`, {
            reviewDate: toIsoDateTime(assessment.reviewDate),
            overallRating: assessment.overallRating,
            feedback: assessment.feedback,
            taskId: assessment.task.id,
            userId: assessment.appUser.id,
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
                message = locale.ASSESSMENTS_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};