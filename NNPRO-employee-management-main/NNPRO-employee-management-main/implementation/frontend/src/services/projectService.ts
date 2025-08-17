import axiosPrivate from "../api/axiosPrivate.ts";
import {Project, ProjectResponse, ProjectsResponse, ProjectStatusesResponse} from "../types/project.ts";
import {AxiosError} from "axios";
import {User} from "../types/auth.ts";
import {toIsoDateTime} from "../utils/date.ts";
import {Member} from "../types/member.ts";
import locale from "../locale/cs.json";
import {StatusCodes} from "http-status-codes";

export const isUserProjectLeader = (project: Project, user: User | Member): boolean => {
    return project.leader.id === user.id;
}

export const getAllProjects = async (page: number, size: number): Promise<ProjectsResponse> => {
    let message = locale.ERROR_LOADING_PROJECTS;

    try {
        const response = await axiosPrivate.get('/projects', {
            params: {
                page: page,
                size: size,
            },
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                projects: response.data.content,
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
                message = locale.PROJECTS_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};

export const getAllUserProjects = async (userId: number, page: number, size: number): Promise<ProjectsResponse> => {
    let message = locale.ERROR_LOADING_PROJECTS;

    try {
        const response = await axiosPrivate.get(`/appUsers/${userId}/my-projects`, {
            params: {
                page: page,
                size: size,
            },
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                projects: response.data.content,
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
                message = locale.PROJECTS_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};

export const getProjectById = async (projectId: number): Promise<ProjectResponse> => {
    let message = locale.ERROR_LOADING_PROJECT;

    try {
        const response = await axiosPrivate.get(`/projects/${projectId}`);

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                project: response.data,
            };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.PROJECT_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};

export const createProject = async (project: Project, user: User): Promise<ProjectResponse> => {
    let message = locale.ERROR_CREATING_PROJECT;

    try {
        const response = await axiosPrivate.post('/projects', {
            appUserId: user.id,
            name: project.name,
            description: project.description,
            dueDate: toIsoDateTime(project.dueDate),
            status: project.status.name,
        });
        if (response.status === StatusCodes.CREATED) {
            return { success: true, project: response.data };
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

export const deleteProject = async (projectId: number): Promise<ProjectResponse> => {
    let message = locale.ERROR_DELETE_PROJECT;

    try {
        const response = await axiosPrivate.delete(`/projects/${projectId}`);
        if (response.status === StatusCodes.NO_CONTENT) {
            return { success: true };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.PROJECT_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};

export const updateProject = async (project: Project, user: User): Promise<ProjectResponse> => {
    let message = locale.ERROR_UPDATE_PROJECT;

    try {
        const response = await axiosPrivate.put(`/projects/${project.id}`, {
            appUserId: user.id,
            name: project.name,
            description: project.description,
            dueDate: toIsoDateTime(project.dueDate),
            status: project.status.name,
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
                message = locale.PROJECT_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};

export const getProjectStatuses = async (): Promise<ProjectStatusesResponse> => {
    try {
        const response = await axiosPrivate.get('/project-statuses');

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                statuses: response.data,
            };
        }

        return { success: false };
    } catch {
        return { success: false };
    }
}