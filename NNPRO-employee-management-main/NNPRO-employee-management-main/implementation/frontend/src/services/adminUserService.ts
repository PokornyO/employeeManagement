import axiosPrivate from "../api/axiosPrivate";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import locale from "../locale/cs.json";
import {UserRequest, UserResponse, UsersResponse} from "../types/user.ts";

export const fetchAllUsers = async (
    page: number,
    size: number
): Promise<UsersResponse> => {
    let message = locale.ERROR_LOADING_USERS;

    try {
        const response = await axiosPrivate.get("/appusers", {
            params: {
                page: page,
                size: size,
            },
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                users: response.data.content,
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

    return { success: false, message };
};

export const createUser = async (user: UserRequest): Promise<UserResponse> => {
    let message = locale.ERROR_CREATING_USER;

    try {
        const response = await axiosPrivate.post('/appusers', user);

        if (response.status === StatusCodes.CREATED) {
            return { success: true, user: response.data };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;

            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.BAD_REQUEST) {
                message = locale.INVALID_USER_DATA;
            }
        }
    }

    return { success: false, message };
};

export const deleteUser = async (userId: number): Promise<UserResponse> => {
    let message = locale.ERROR_DELETE_USER;

    try {
        const response = await axiosPrivate.delete(`/appusers/${userId}`);
        if (response.status === StatusCodes.NO_CONTENT) {
            return { success: true };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                message = locale.UNAUTHORIZED_ACCESS;
            } else if (status === StatusCodes.NOT_FOUND) {
                message = locale.USER_NOT_FOUND;
            }
        }
    }

    return { success: false, message };
};