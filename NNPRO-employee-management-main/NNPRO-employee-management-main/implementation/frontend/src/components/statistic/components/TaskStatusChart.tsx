import React from "react";
import { BarChart } from "@mui/x-charts";
import {Box, Typography, useMediaQuery} from "@mui/material";
import { GlobalProjectStatistics } from "../../../types/statistic.ts";
import Loading from "../../loading/Loading.tsx";
import {useTheme} from "styled-components";
import locale from "../../../locale/cs.json";

interface TaskStatusChartProps {
    data: GlobalProjectStatistics | null;
    isLoading: boolean;
}

const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ data, isLoading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery("(max-width:900px)");

    if (isLoading) {
        return <Loading />;
    }

    if (!data) {
        return null;
    }

    const chartData = [
        { id: 1, status: locale.TO_DO, tasks: data.todoTasks },
        { id: 2, status: locale.IN_PROGRESS, tasks: data.inProgressTasks },
        { id: 3, status: locale.TO_REVIEW, tasks: data.toBeReviewedTasks },
        { id: 4, status: locale.DONE, tasks: data.completedTasks },
    ];

    return (
        <Box m={2}>
            <Typography variant="h6" align="center">
                {locale.TASK_DISTRIBUTION_BY_STATE}
            </Typography>
            <BarChart
                xAxis={[
                    {
                        colorMap: {
                            type: "ordinal",
                            colors: [theme.error, theme.warning, theme.primaryLight, theme.success],
                        },
                        dataKey: "status",
                        scaleType: "band",
                    },
                ]}
                series={[
                    {
                        dataKey: "tasks",
                    },
                ]}
                dataset={chartData}
                width={isMobile ? 400 : 600}
                height={400}
            />
        </Box>
    );
};

export default TaskStatusChart;
