import locale from "../locale/cs.json";
import axiosPrivate from "../api/axiosPrivate.ts";
import {StatusCodes} from "http-status-codes";
import {AxiosError} from "axios";
import {
    GlobalDailyStatisticsResponse,
    GlobalProjectStatisticsResponse,
    LeaderboardStatisticsResponse
} from "../types/statistic.ts";
import {toIsoDate} from "../utils/date.ts";

export const getGlobalProjectStatistics = async (projectId: number): Promise<GlobalProjectStatisticsResponse> => {
    let message = locale.ERROR_LOADING_STATISTICS;

    try {
        const response = await axiosPrivate.get(`/projects/${projectId}/statistics`);

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                statistics: {
                    totalTasks: response.data.totalTasks,
                    todoTasks: response.data.todoTasks,
                    inProgressTasks: response.data.inProgressTasks,
                    toBeReviewedTasks: response.data.toBeReviewedTasks,
                    completedTasks: response.data.completedTasks,
                    completedTasksOnTime: response.data.completedTasksOnTime,
                    completedTasksLate: response.data.completedTasksLate,
                }
            };
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

export const getGlobalDailyStatistics = async (projectId: number, dateFrom: Date, dateTo: Date): Promise<GlobalDailyStatisticsResponse> => {
    let message = locale.ERROR_LOADING_STATISTICS;

    try {
        const response = await axiosPrivate.get(`/appusers/projects/${projectId}/statistics-daily`, {
            params: {
                startDate: toIsoDate(dateFrom),
                endDate: toIsoDate(dateTo)
            }
        });

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                statistics: response.data
            };
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

export const getLeaderboardStatistics = async (projectId: number): Promise<LeaderboardStatisticsResponse> => {
    let message = locale.ERROR_LOADING_STATISTICS;

    try {
        const response = await axiosPrivate.get(`/appusers/projects/${projectId}/leaderboard`);

        if (response.status === StatusCodes.OK) {
            return {
                success: true,
                statistics: response.data
            };
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