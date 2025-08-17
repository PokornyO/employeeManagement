import {Task} from "./task.ts";
import {Member} from "./member.ts";
import {User} from "./auth.ts";
import {PaginatedResponse} from "./pagination.ts";

export interface Assessment {
    id: number;
    feedback: string;
    reviewDate: string;
    overallRating: number;
    task: Task;
    appUser: Member | User;
}

export interface AssessmentResponse {
    success: boolean;
    assessment?: Assessment;
    message?: string;
}

export interface AssessmentsResponse {
    success: boolean;
    assessments?: Assessment[];
    message?: string;
    pagination?: PaginatedResponse;
}