import locale from "../locale/cs.json";
import axiosPrivate from "../api/axiosPrivate.ts";
import {StatusCodes} from "http-status-codes";
import {AxiosError} from "axios";
import {Attendance, AttendanceResponse, AttendancesResponse} from "../types/attendance.ts";
import {toIsoDateTime} from "../utils/date.ts";
import {Member, MemberResponse} from "../types/member.ts";
import {User} from "../types/auth.ts";
import {Task} from "../types/task.ts";


export const doesUserClaimTask =  async (task: Task, user: User | Member): Promise<boolean> => {
    try {
        const response = await getAllTasksUsers(task.id, 0, 100);
        return (response.success && response.members?.some((member) => member.id === user.id));
    } catch (error) {
        console.error("Error fetching task users:", error);
        return false;
    }
};

export const calculateTotalHoursByTaskAndUser = async (taskId: number, userId: number): Promise<number> => {
    try {
        const response = await getAllTasksAttendance(taskId, 0, 1000);

        if (!response.success || !response.attendances) {
            console.error("Error fetching attendances:", response.message);
            return 0;
        }
        const userAttendances = response.attendances.filter((attendance: Attendance) => attendance.appUser.id === userId);

        return userAttendances.reduce((total, attendance) => {
            const startTime = new Date(attendance.startTime).getTime();
            const endTime = new Date(attendance.endTime).getTime();

            if (isNaN(startTime) || isNaN(endTime)) {
                return total;
            }
            const hours = (endTime - startTime) / (1000 * 60 * 60);
            return total + hours;
        }, 0);
    } catch (error) {
        console.error("Error calculating total hours:", error);
        return 0;
    }
};

export const calculateTotalHoursByTask = async (taskId: number): Promise<number> => {
    try {
        const response = await getAllTasksAttendance(taskId, 0, 1000);

        if (!response.success || !response.attendances) {
            console.error("Error fetching attendances:", response.message);
            return 0;
        }

        return response.attendances.reduce((total, attendance) => {
            const startTime = new Date(attendance.startTime).getTime();
            const endTime = new Date(attendance.endTime).getTime();

            if (isNaN(startTime) || isNaN(endTime)) {
                return total;
            }
            const hours = (endTime - startTime) / (1000 * 60 * 60);
            return total + hours;
        }, 0);
    } catch (error) {
        console.error("Error calculating total hours:", error);
        return 0;
    }
};

export const getAllTasksAttendance = async (taskId: number, page: number, size: number): Promise<AttendancesResponse> => {
    let message = locale.ERROR_LOADING_ATENDANCES;
    try {
        const response = await axiosPrivate.get(`/attendances/tasks/${taskId}`, {
            params: {
                page: page,
                size: size,
            },
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                attendances: response.data.content,
                pagination: {
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    pageNumber: response.data.pageable.pageNumber,
                    pageSize: response.data.pageable.pageSize,
                    isFirst: response.data.first,
                    isLast: response.data.last,
                },
            };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.ATTENDANCES_NOT_FOUND;
            }
        }
    }
    return { success: false, message: message };
};

export const getAllTasksUsers = async (taskId: number, page: number, size: number): Promise<MemberResponse> => {
    let message = locale.ERROR_LOADING_MEMBERS;
    try {
        const response = await axiosPrivate.get(`/appusers/tasks/${taskId}`, {
            params: {
                page: page,
                size: size,
            },
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                members: response.data.content,
                pagination: {
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    pageNumber: response.data.pageable.pageNumber,
                    pageSize: response.data.pageable.pageSize,
                    isFirst: response.data.first,
                    isLast: response.data.last,
                },
            };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.USERS_NOT_FOUND;
            }
        }
    }
    return { success: false, message: message };
};

export const createAttendance = async (attendance: Attendance): Promise<AttendanceResponse> => {
    let message = locale.ERROR_CREATING_ATTENDANCE;
    try {
        const response = await axiosPrivate.post('/attendances', {
            startTime: toIsoDateTime(attendance.startTime),
            endTime: toIsoDateTime(attendance.endTime),
            taskId: attendance.taskId,
            appUserId: attendance.appUser.id,
            workDescription: attendance.workDescription,
        });

        if (response.status === StatusCodes.CREATED) {
            return { success: true, attendance: response.data };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            }
        }
    }
    return { success: false, message: message };
};

export const deleteAttendance = async (attendanceId: number): Promise<AttendanceResponse> => {
    let message = locale.ERROR_DELETE_ATTENDANCE;

    try {
        const response = await axiosPrivate.delete(`/attendances/${attendanceId}`);
        if (response.status === StatusCodes.NO_CONTENT) {
            return { success: true };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.ATTENDANCES_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};

export const updateAttendance = async (attendance: Attendance): Promise<AttendanceResponse> => {
    let message = locale.ERROR_UPDATE_ATTENDANCE;

    try {
        const response = await axiosPrivate.put(`/attendances/${attendance.id}`, {
            startTime: toIsoDateTime(attendance.startTime),
            endTime: toIsoDateTime(attendance.endTime),
            workDescription: attendance.workDescription,
            taskId: attendance.taskId,
            appUserId: attendance.appUser.id,
        });
        if (response.status === StatusCodes.OK) {
            return { success: true };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.ATTENDANCES_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};

export const assignTask = async (userId: number, taskId: number): Promise<{ success: boolean; status?: number; message?: string }> => {
    let message = locale.ERROR_CLAIM_TASK;

    try {
        const response = await axiosPrivate.post(`/appusers/${userId}/tasks/${taskId}/assign`);
        if (response.status === StatusCodes.CREATED) {
            return { success: true, status: StatusCodes.CREATED };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.TASKS_NOT_FOUND;
            }
        }
    }

    return { success: false, message: message };
};