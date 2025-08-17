import {Member} from "./member.ts";

export interface GlobalProjectStatistics {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    toBeReviewedTasks: number;
    completedTasks: number;
    completedTasksOnTime: number;
    completedTasksLate: number;
}

export interface GlobalProjectStatisticsResponse {
    success: boolean;
    statistics?: GlobalProjectStatistics | null;
    message?: string;
}

export interface GlobalDailyStatistics {
    date: string;
    totalCompletedTasks: number;
    totalWorkedHours: number;
}

export interface GlobalDailyStatisticsResponse {
    success: boolean;
    statistics?: GlobalDailyStatistics[] | null;
    message?: string;
}

export interface LeaderboardStatistics {
    completedTasks: number;
    workedHours: number;
    appuser: Member;
}

export interface LeaderboardStatisticsResponse {
    success: boolean;
    statistics?: LeaderboardStatistics[] | null;
    message?: string;
}