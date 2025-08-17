import roleHierarchy from "../constants/roleHierarchy.json";
import locale from "../locale/cs.json";

export enum Role {
    ADMIN = "ROLE_ADMIN",
    LEADER = "ROLE_LEADER",
    EMPLOYEE = "ROLE_EMPLOYEE",
}

export const ROLES: Record<Role, number> = roleHierarchy as Record<Role, number>;

export const getRoleLabel = (role: Role): string => {
    switch (role) {
        case Role.ADMIN:
            return locale.ROLE_ADMIN;
        case Role.LEADER:
            return locale.ROLE_LEADER;
        case Role.EMPLOYEE:
            return locale.ROLE_EMPLOYEE;
    }
}