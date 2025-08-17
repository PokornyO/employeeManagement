import React from "react";
import { PieChart } from "@mui/x-charts";
import {Box, Typography, useMediaQuery} from "@mui/material";
import { GlobalProjectStatistics } from "../../../types/statistic.ts";
import {useTheme} from "styled-components";
import Loading from "../../loading/Loading.tsx";
import locale from "../../../locale/cs.json";

interface TaskCompletionChartProps {
    data: GlobalProjectStatistics | null;
    isLoading: boolean;
}

const TaskCompletionChart: React.FC<TaskCompletionChartProps> = ({ data, isLoading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery("(max-width:900px)");

    if (isLoading) {
        return <Loading />;
    }

    if (!data) {
        return null;
    }

    const chartData = [
        { id: 1, label: locale.COMPLETED_ON_TIME, value: data.completedTasksOnTime, color: theme.success },
        { id: 2, label: locale.COMPLETED_LATE, value: data.completedTasksLate, color: theme.error },
    ];

    return (
        <Box m={2}>
            <Typography variant="h6" align="center">
                Dokončení úkolů
            </Typography>
            <PieChart
                series={[
                    {
                        arcLabel: (item) => `${item.value}`,
                        data: chartData,
                    },
                ]}
                width={isMobile ? 400 : 600}
                height={300}
            />
        </Box>
    );
};

export default TaskCompletionChart;
