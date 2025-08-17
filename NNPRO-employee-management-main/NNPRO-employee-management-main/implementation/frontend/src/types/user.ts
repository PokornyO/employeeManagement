import {PaginatedResponse} from "./pagination.ts";
import {User} from "./auth.ts";

export interface UserRequest {
    username: string;
    password: string;
    email: string;
    role: string;
    firstName: string;
    surname: string;
    phoneNumber?: string;
}

export interface UserResponse {
    success: boolean;
    message?: string;
    user?: User;
}

export interface UsersResponse {
    success: boolean;
    users?: User[];
    pagination?: PaginatedResponse;
    message?: string;
}