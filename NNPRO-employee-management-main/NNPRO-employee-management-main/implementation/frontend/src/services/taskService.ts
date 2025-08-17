import {AxiosError} from "axios";
import {Task, TaskDifficultyResponse, TaskResponse, TasksResponse, TaskStatusesResponse} from "../types/task.ts";
import axiosPrivate from "../api/axiosPrivate.ts";
import {Project} from "../types/project.ts";
import {User} from "../types/auth.ts";
import {Member} from "../types/member.ts";
import {toIsoDateTime} from "../utils/date.ts";
import locale from "../locale/cs.json";
import {StatusCodes} from "http-status-codes";

export interface GetAllProjectTasksParams {
    page: number;
    size: number;
    minDueDate?: string;
    maxDueDate?: string;
}

export const isUserProjectLeader = (project: Project, user: User | Member): boolean => {
    return project.leader.id === user.id;
}

export const getEstimatedFinishDateForNewTask = async (difficulty: string): Promise<string> => {
    try {
        const response = await axiosPrivate.get("/tasks/taskFinishPrediction");
        if (response.status !== StatusCodes.OK) {
            console.error("Error fetching estimated finish date:", response.statusText);
        }

        const data: Record<string, string> = response.data;
        const estimatedDateMap = new Map(Object.entries(data));
        if (difficulty === 'EASY') {
            return [...estimatedDateMap.values()][0];
        }
        else if (difficulty === 'MEDIUM') {
            return [...estimatedDateMap.values()][1];
        }
        else {
            return [...estimatedDateMap.values()][2];
        }
    } catch (error) {
        console.error("Error fetching estimated finish date:", error);
    }
};

export const getAllProjectTasks = async (projectId: number, page: number, size: number, minDueDate?: Date, maxDueDate?: Date): Promise<TasksResponse> => {
    let message = locale.ERROR_LOADING_TASKS;

    const params: GetAllProjectTasksParams = {
        page: page,
        size: size,
    };

    if (minDueDate && maxDueDate) {
        params.minDueDate = toIsoDateTime(minDueDate);
        params.maxDueDate = toIsoDateTime(maxDueDate);
    }

    try {
        const response = await axiosPrivate.get(`/projects/${projectId}/tasks`, {
            params: params
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                tasks: response.data.content,
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
                message = locale.TASKS_NOT_FOUND;
            }
        }
    }
    return { success: false, message: message };
};

export const getTaskById = async (taskId: number): Promise<TaskResponse> => {
    let message = locale.TASK_NOT_FOUND;

    try {
        const response = await axiosPrivate.get(`/tasks/${taskId}`);

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                task: response.data,
            };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.TASKS_NOT_FOUND;
            }
        }
    }
    return { success: false, message: message };
};

export const createTask = async (task: Task): Promise<TaskResponse> => {
    let message = locale.ERROR_CREATING_TASK;

    try {
        const response = await axiosPrivate.post('/tasks', {
            title: task.title,
            description: task.description,
            dueDate: toIsoDateTime(task.dueDate),
            status: task.status.name,
            finishDate: toIsoDateTime(task.finishDate),
            difficulty: task.difficulty.name,
            projectId: task.projectId,

        });
        if (response.status === StatusCodes.CREATED) {
            return { success: true, task: response.data };
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

export const deleteTask = async (taskId: number): Promise<TaskResponse> => {
    let message = locale.ERROR_DELETE_TASK;

    try {
        const response = await axiosPrivate.delete(`/tasks/${taskId}`);
        if (response.status === StatusCodes.NO_CONTENT) {
            return { success: true };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.TASKS_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};

export const updateTask = async (task: Task): Promise<TaskResponse> => {
    let message = locale.ERROR_UPDATE_TASK;

    try {
        const response = await axiosPrivate.put(`/tasks/${task.id}`, {
            title: task.title,
            description: task.description,
            dueDate: toIsoDateTime(task.dueDate),
            status: task.status.name,
            finishDate: toIsoDateTime(task.finishDate),
            difficulty: task.difficulty.name,
            projectId: task.projectId,
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
                message = locale.TASKS_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};

export const getTaskStatuses = async (): Promise<TaskStatusesResponse> => {
    try {
        const response = await axiosPrivate.get('/task-statuses');

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

export const getTaskDifficulties = async (): Promise<TaskDifficultyResponse> => {
    try {
        const response = await axiosPrivate.get('/task-difficulty-levels');

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
