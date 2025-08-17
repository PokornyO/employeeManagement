import {User} from "./auth.ts";

export interface LoginResponse {
    success: boolean;
    user?: User;
    message?: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message?: string;
}