import {AxiosError} from "axios";
import axiosPrivate from "../api/axiosPrivate.ts";
import locale from "../locale/cs.json";
import {MemberResponse} from "../types/member.ts";
import {StatusCodes} from "http-status-codes";

export const searchUsers = async (search: string): Promise<MemberResponse> => {
    try {
        const response = await axiosPrivate.get('/appusers/employee', {
            params: {
                inputString: search,
                page: 0,
                size: 100,
            },
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true, members: response.data.content
            };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                return { success: false, message: locale.UNAUTHORIZED_ACCESS };
            }
        }
    }

    return { success: false, message: locale.ERROR_PROCESSING };
}

export const getAllProjectMembers = async (projectId: number, page: number, size: number): Promise<MemberResponse> => {
    try {
        const response = await axiosPrivate.get(`/appusers/projects/${projectId}`, {
            params: {
                page: page,
                size: size,
            },
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                members: response.data.content,
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
                return { success: false, message: locale.UNAUTHORIZED_ACCESS };
            }
        }
    }

    return { success: false, message: locale.ERROR_PROCESSING };
};

export const addMemberToProject = async (projectId: number, userId: number): Promise<MemberResponse> => {
    try {
        const response = await axiosPrivate.post(`/appusers/${userId}/projects/${projectId}/assign`);

        if (response.status === StatusCodes.CREATED) {
            return { success: true };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                return { success: false, message: locale.UNAUTHORIZED_ACCESS };
            } else if (status === StatusCodes.CONFLICT) {
                return { success: false, message: locale.USER_ALREADY_MEMBER };
            }
        }
    }

    return { success: false, message: locale.ERROR_PROCESSING };
}

export const removeMemberFromProject = async (projectId: number, userId: number): Promise<MemberResponse> => {
    try {
        const response = await axiosPrivate.post(`/appusers/${userId}/projects/${projectId}/remove`);

        if (response.status === StatusCodes.OK) {
            return { success: true };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                return { success: false, message: locale.UNAUTHORIZED_ACCESS };
            }
        }
    }

    return { success: false, message: locale.ERROR_PROCESSING };
}