import {Role} from "./role.ts";
import {PaginatedResponse} from "./pagination.ts";

export interface Member {
    id: number;
    username: string;
    email: string;
    firstName: string | null;
    surname: string | null;
    phoneNumber: string | null;
    role: Role;
}

export interface MemberResponse {
    success: boolean;
    members?: Member[];
    message?: string;
    pagination?: PaginatedResponse;
}
