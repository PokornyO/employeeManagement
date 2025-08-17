import React from "react";
import { Typography } from "@mui/material";
import { GlobalProjectStatistics } from "../../../types/statistic.ts";
import Loading from "../../loading/Loading.tsx";
import {useTheme} from "styled-components";
import StatisticPaper from "../layout/StatisticPaper.tsx";
import locale from "../../../locale/cs.json";

interface TotalTasksInfoProps {
    data: GlobalProjectStatistics | null;
    isLoading: boolean;
}

const TotalTasksInfo: React.FC<TotalTasksInfoProps> = ({ data, isLoading }) => {
    const theme = useTheme();

    if (isLoading) {
        return <Loading />;
    }

    if (!data) {
        return null;
    }

    return (
        <StatisticPaper>
            <Typography variant="h3" sx={{ color: theme.success }}>
                {data.totalTasks}
            </Typography>
            <Typography align="center">
                {locale.TOTAL_TASK_COUNT}
            </Typography>
        </StatisticPaper>
    );
};

export default TotalTasksInfo;
