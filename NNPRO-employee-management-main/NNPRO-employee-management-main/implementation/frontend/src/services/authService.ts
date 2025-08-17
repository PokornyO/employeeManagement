import axiosPublic from "../api/axiosPublic.ts";
import {AxiosError} from "axios";
import locale from "../locale/cs.json";
import {StatusCodes} from "http-status-codes";
import {ChangePasswordResponse, LoginResponse} from "../types/login.ts";
import axiosPrivate from "../api/axiosPrivate.ts";

export const loginRequest = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axiosPublic.post('/auth/login', {
            username,
            password,
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true, user: {
                    id: response.data.userId,
                    email: response.data.email,
                    username: response.data.username,
                    firstName: response.data.firstName,
                    surname: response.data.surname,
                    phoneNumber: response.data.phoneNumber,
                    role: response.data.role,
                    tokens: {
                        access: response.data.accessToken,
                        refresh: null,
                    },
                }
            };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                return { success: false, message: locale.INVALID_EMAIL_OR_PASSWORD };
            }
        }
    }

    return { success: false, message: locale.ERROR_PROCESSING };
};

export const changePasswordRequest = async (currentPassword: string, newPassword: string): Promise<ChangePasswordResponse> => {
    try {
        const response = await axiosPrivate.post('/password/change', {
            oldPassword: currentPassword,
            newPassword: newPassword,
        });

        if (response.status === StatusCodes.OK) {
            return { success: true };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === StatusCodes.UNAUTHORIZED) {
                return { success: false, message: locale.INVALID_PASSWORD };
            }
        }
    }

    return { success: false, message: locale.ERROR_PROCESSING };
}