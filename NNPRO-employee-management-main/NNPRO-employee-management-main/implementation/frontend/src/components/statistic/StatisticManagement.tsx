import React, { useEffect, useState } from "react";
import {GlobalDailyStatistics, GlobalProjectStatistics, LeaderboardStatistics} from "../../types/statistic";
import { Box } from "@mui/material";
import TaskStatusChart from "./components/TaskStatusChart.tsx";
import TaskCompletionChart from "./components/TaskCompletionChart.tsx";
import {
    getGlobalDailyStatistics,
    getGlobalProjectStatistics,
    getLeaderboardStatistics
} from "../../services/statisticService";
import { useProject } from "../providers/ProjectProvider";
import OnTimeCompletionInfo from "./components/OnTimeCompletionInfo.tsx";
import TotalTasksInfo from "./components/TotalTaskInfo.tsx";
import StatisticSectionWrapper from "./layout/StatisticSectionWrapper.tsx";
import TimeSeriesChart from "./components/TimeSeriesChart.tsx";
import LeaderboardTable from "./components/LeaderboardTable.tsx";

const StatisticManagement: React.FC = () => {
    const { project } = useProject();

    const [projectStatistics, setProjectStatistics] = useState<GlobalProjectStatistics | null>(null);
    const [isProjectStatisticsLoading, setIsProjectStatisticsLoading] = useState<boolean>(true);

    const [timeSeriesData, setTimeSeriesData] = useState<GlobalDailyStatistics[] | null>(null);
    const [isTimeSeriesLoading, setIsTimeSeriesLoading] = useState<boolean>(true);

    const [leaderboardStatistics, setLeaderboardStatistics] = useState<LeaderboardStatistics[] | null>(null);
    const [isLeaderboardLoading, setIsLeaderboardLoading] = useState<boolean>(true);

    const fetchProjectStatistics = () => {
        setIsProjectStatisticsLoading(true);
        getGlobalProjectStatistics(project!.id)
            .then((response) => {
                if (response.success) {
                    setProjectStatistics(response.statistics!);
                }
            })
            .finally(() => {
                setIsProjectStatisticsLoading(false);
            });
    };

    const fetchTimeSeriesData = (days: number) => {
        setIsTimeSeriesLoading(true);
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - days);

        getGlobalDailyStatistics(project!.id, pastDate, today)
            .then((response) => {
                if (response.success) {
                    setTimeSeriesData(response.statistics!);
                }
            })
            .finally(() => {
                setIsTimeSeriesLoading(false);
            });
    };

    const fetchLeaderboardStatistics = () => {
        setIsLeaderboardLoading(true);
        getLeaderboardStatistics(project!.id)
            .then((response) => {
                if (response.success) {
                    setLeaderboardStatistics(response.statistics!);
                }
            })
            .finally(() => {
                setIsLeaderboardLoading(false);
            });
    }

    useEffect(() => {
        fetchProjectStatistics();
        fetchTimeSeriesData(7);
        fetchLeaderboardStatistics();
    }, [project]);

    return (
        <Box mt={4} display="flex" flexDirection="column" alignItems="center" gap={4}>
            <StatisticSectionWrapper>
                <TaskStatusChart data={projectStatistics} isLoading={isProjectStatisticsLoading} />
                <OnTimeCompletionInfo data={projectStatistics} isLoading={isProjectStatisticsLoading} />
            </StatisticSectionWrapper>
            <StatisticSectionWrapper>
                <TaskCompletionChart data={projectStatistics} isLoading={isProjectStatisticsLoading} />
                <TotalTasksInfo data={projectStatistics} isLoading={isProjectStatisticsLoading} />
            </StatisticSectionWrapper>
            <StatisticSectionWrapper>
                <LeaderboardTable data={leaderboardStatistics} isLoading={isLeaderboardLoading} />
            </StatisticSectionWrapper>
            <StatisticSectionWrapper>
                <TimeSeriesChart data={timeSeriesData} isLoading={isTimeSeriesLoading} onDateRangeChange={fetchTimeSeriesData} />
            </StatisticSectionWrapper>
        </Box>
    );
};

export default StatisticManagement;
