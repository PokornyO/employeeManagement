import {Member} from "./member.ts";
import {User} from "./auth.ts";
import {PaginatedResponse} from "./pagination.ts";

export interface Project {
    id: number;
    name: string;
    description: string;
    dueDate: string;
    leader: Member | User;
    status: Status;
}

export interface ProjectsResponse {
    success: boolean;
    projects?: Project[];
    message?: string;
    pagination?: PaginatedResponse;
}

export interface ProjectResponse {
    success: boolean;
    project?: Project;
    message?: string;
}

export interface ProjectStatusesResponse {
    success: boolean;
    statuses?: Status[];
    message?: string;
}

export interface Status {
    name: string;
    label: string;
}

