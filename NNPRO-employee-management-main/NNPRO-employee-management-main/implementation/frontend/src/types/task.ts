import {PaginatedResponse} from "./pagination.ts";
import {Member} from "./member.ts";

export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    status: Status;
    finishDate: string;
    difficulty: Status;
    projectId: number;
    assignedUsers: Member[];
}

export interface TaskResponse {
    success: boolean;
    task?: Task;
    message?: string;
}

export interface TasksResponse {
    success: boolean;
    tasks?: Task[];
    message?: string;
    pagination?: PaginatedResponse;
}

export interface TaskStatusesResponse {
    success: boolean;
    statuses?: Status[];
    message?: string;
}
export interface TaskDifficultyResponse {
    success: boolean;
    statuses?: Status[];
    message?: string;
}

export interface Status {
    name: string;
    label: string;
}
