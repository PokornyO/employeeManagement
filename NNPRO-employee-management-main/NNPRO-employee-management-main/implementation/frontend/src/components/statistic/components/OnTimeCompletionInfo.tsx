import React from "react";
import { Typography } from "@mui/material";
import { GlobalProjectStatistics } from "../../../types/statistic.ts";
import {useTheme} from "styled-components";
import Loading from "../../loading/Loading.tsx";
import StatisticPaper from "../layout/StatisticPaper.tsx";
import locale from "../../../locale/cs.json";

interface OnTimeCompletionInfoProps {
    data: GlobalProjectStatistics | null;
    isLoading: boolean;
}

const OnTimeCompletionInfo: React.FC<OnTimeCompletionInfoProps> = ({ data, isLoading }) => {
    const theme = useTheme();

    if (isLoading) {
        return <Loading />;
    }

    if (!data) {
        return null;
    }

    const getColorByPercentage = (percentage: number) => {
        if (percentage >= 80) {
            return theme.success;
        }

        if (percentage >= 50) {
            return theme.warning;
        }

        return theme.error;
    }

    const totalCompletedTasks = data.completedTasksOnTime + data.completedTasksLate;
    const onTimePercentage =
        totalCompletedTasks > 0
            ? Math.round((data.completedTasksOnTime / totalCompletedTasks) * 100)
            : 0;

    return (
        <StatisticPaper>
            <Typography variant="h3" sx={{ color: getColorByPercentage(onTimePercentage) }}>
                {onTimePercentage}%
            </Typography>
            <Typography align="center">
                {locale.TASKS_COMPLETED_ON_TIME}
            </Typography>
        </StatisticPaper>
    );
};

export default OnTimeCompletionInfo;
