import {PaginatedResponse} from "./pagination.ts";
import {Member} from "./member.ts";
import {User} from "./auth.ts";

export interface Attendance {
    id: number;
    startTime: string;
    endTime: string;
    workDescription: string;
    taskId: number;
    appUser: Member | User;
}

export interface AttendanceResponse {
    success: boolean;
    attendance?: Attendance;
    message?: string;
}

export interface AttendancesResponse {
    success: boolean;
    attendances?: Attendance[];
    message?: string;
    pagination?: PaginatedResponse;
}