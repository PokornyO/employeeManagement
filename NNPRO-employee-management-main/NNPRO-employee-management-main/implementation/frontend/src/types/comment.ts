import {PaginatedResponse} from "./pagination.ts";
import {Member} from "./member.ts";
import {User} from "./auth.ts";
import {Task} from "./task.ts";

export interface Comment {
    id: number;
    text: string;
    createdDate: string;
    task: Task;
    appUser: Member | User;
}

export interface CommentResponse {
    success: boolean;
    comment?: Comment;
    message?: string;
}

export interface CommentsResponse {
    success: boolean;
    comments?: Comment[];
    message?: string;
    pagination?: PaginatedResponse;
}
