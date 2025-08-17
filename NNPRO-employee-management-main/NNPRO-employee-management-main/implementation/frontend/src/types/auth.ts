import {Role} from "./role.ts";

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string | null;
    surname: string | null;
    phoneNumber: string | null;
    role: Role;
    tokens: {
        access: string;
        refresh: string | null;
    };
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    hasAccess: (requiredRole: Role) => boolean;
}